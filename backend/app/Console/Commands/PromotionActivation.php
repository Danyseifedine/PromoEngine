<?php

namespace App\Console\Commands;

use App\Models\PromotionRule;
use Illuminate\Console\Command;

class PromotionActivation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promotion:activate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Activate and deactivate promotions based on their validity dates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing promotion activation/deactivation...');

        // 1. Activate promotions that should be active but are currently inactive
        $toActivate = PromotionRule::where('active', false)
            ->currentlyValid()
            ->get();

        $activatedCount = 0;
        foreach ($toActivate as $promotion) {
            $promotion->update(['active' => true]);
            $activatedCount++;
            $this->line("✓ Activated: {$promotion->name}");
        }

        // 2. Deactivate promotions that are no longer valid but are currently active
        $now = now();
        $toDeactivate = PromotionRule::where('active', true)
            ->where(function ($query) use ($now) {
                $query->where(function ($q) use ($now) {
                    // valid_from is set and is in the future
                    $q->whereNotNull('valid_from')
                        ->where('valid_from', '>', $now);
                })
                    ->orWhere(function ($q) use ($now) {
                        // valid_until is set and is in the past
                        $q->whereNotNull('valid_until')
                            ->where('valid_until', '<', $now);
                    });
            })
            ->get();

        $deactivatedCount = 0;
        foreach ($toDeactivate as $promotion) {
            $promotion->update(['active' => false]);
            $deactivatedCount++;
            $this->line("✗ Deactivated: {$promotion->name}");
        }

        // Summary
        $this->newLine();
        $this->info("Summary:");
        $this->table(
            ['Action', 'Count'],
            [
                ['Activated', $activatedCount],
                ['Deactivated', $deactivatedCount],
                ['Total Processed', $activatedCount + $deactivatedCount]
            ]
        );

        if ($activatedCount === 0 && $deactivatedCount === 0) {
            $this->comment('No promotions needed activation or deactivation.');
        }

        return Command::SUCCESS;
    }
}
