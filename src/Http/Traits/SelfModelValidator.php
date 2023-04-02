<?php

namespace Sefirosweb\LaravelAccessList\Http\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

trait SelfModelValidator
{
    protected $rules = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $rules = method_exists($this, 'getValidationRules') ? $this->getValidationRules(new Request($attributes)) : [];
        $this->changeRules($rules);
    }

    public static function bootSelfModelValidator()
    {
        static::retrieved(function ($model) {
            $rules = method_exists($model, 'getValidationRules') ? $model->getValidationRules(new Request($model->toArray())) : [];
            $model->changeRules($rules);
        });

        static::saving(function ($model) {
            Validator::make($model->toArray(), $model->rules)->validate();
        });

        static::creating(function ($model) {
            Validator::make($model->toArray(), $model->rules)->validate();
        });
    }

    public function changeRules($rules)
    {
        $this->rules = $rules;
    }

    public static function getRules(Request $request = null)
    {
        $model = new self($request === null ? [] : $request->all());
        return isset($model->rules) ? $model->rules : [];
    }
}
