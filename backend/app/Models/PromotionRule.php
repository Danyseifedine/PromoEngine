<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionRule extends Model
{
    protected $fillable = [
        'name',
        'salience',
        'stackable',
        'conditions',
        'actions',
        'visual_data',
        'active',
        'valid_from',
        'valid_until'
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'visual_data' => 'array',
        'stackable' => 'boolean',
        'active' => 'boolean',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Get promotion rules that are currently valid (within date range)
     */
    public function scopeCurrentlyValid($query)
    {
        $now = now();
        return $query->where(function ($q) use ($now) {
            $q->where(function ($subQ) use ($now) {
                // valid_from is null OR valid_from <= now
                $subQ->whereNull('valid_from')
                    ->orWhere('valid_from', '<=', $now);
            })
                ->where(function ($subQ) use ($now) {
                    // valid_until is null OR valid_until >= now
                    $subQ->whereNull('valid_until')
                        ->orWhere('valid_until', '>=', $now);
                });
        });
    }

    /**
     * Get stackable promotion rules
     */
    public function scopeStackable($query)
    {
        return $query->where('stackable', true);
    }

    /**
     * Get non-stackable promotion rules
     */
    public function scopeNonStackable($query)
    {
        return $query->where('stackable', false);
    }

    /**
     * Order by salience (priority)
     */
    public function scopeOrderBySalience($query, $direction = 'asc')
    {
        return $query->orderBy('salience', $direction);
    }

    /**
     * Check if the rule is currently valid
     */
    public function isCurrentlyValid(): bool
    {
        $now = now();

        $validFrom = $this->valid_from === null || $this->valid_from <= $now;
        $validUntil = $this->valid_until === null || $this->valid_until >= $now;

        return $this->active && $validFrom && $validUntil;
    }

    /**
     * Get rules ready for evaluation (active and currently valid)
     */
    public function scopeReadyForEvaluation($query)
    {
        return $query->active()
            ->currentlyValid()
            ->orderBySalience();
    }

    /**
     * Get a human-readable description of the conditions
     */
    public function getConditionsDescription(): string
    {
        if (!$this->conditions) {
            return 'No conditions set';
        }

        return $this->buildConditionDescription($this->conditions);
    }

    /**
     * Recursively build condition description
     */
    private function buildConditionDescription($conditions): string
    {
        if (isset($conditions['type']) && in_array($conditions['type'], ['AND', 'OR'])) {
            $descriptions = [];
            foreach ($conditions['rules'] as $rule) {
                $descriptions[] = $this->buildConditionDescription($rule);
            }
            return '(' . implode(' ' . $conditions['type'] . ' ', $descriptions) . ')';
        } else {
            // Single condition
            $field = $conditions['field'] ?? 'unknown';
            $operator = $conditions['operator'] ?? 'equals';
            $value = $conditions['value'] ?? 'unknown';

            return "{$field} {$operator} {$value}";
        }
    }

    /**
     * Get a human-readable description of the actions
     */
    public function getActionsDescription(): string
    {
        if (!$this->actions) {
            return 'No actions set';
        }

        $descriptions = [];
        foreach ($this->actions as $action) {
            $type = $action['type'] ?? 'unknown';
            $value = $action['value'] ?? 'unknown';

            switch ($type) {
                case 'applyPercent':
                    $descriptions[] = "Apply {$value}% discount";
                    break;
                case 'applyFreeUnits':
                    $descriptions[] = "Give 1 free unit";
                    break;
                default:
                    $descriptions[] = "{$type}: {$value}";
            }
        }

        return implode(', ', $descriptions);
    }

    /**
     * Get the visual builder data for editing
     */
    public function getVisualData(): ?array
    {
        return $this->visual_data;
    }

    /**
     * Update the visual data
     */
    public function updateVisualData(array $visualData): void
    {
        $this->visual_data = $visualData;
        $this->save();
    }
}
