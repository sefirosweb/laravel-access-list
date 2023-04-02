<?php

namespace Sefirosweb\LaravelAccessList\Http\Traits;

use Illuminate\Support\Facades\Validator;

trait SelfModelValidator
{
    public static function bootSelfModelValidator()
    {
        static::saving(function ($model) {
            Validator::make($model->toArray(), $model::getRules())->validate();
        });

        static::creating(function ($model) {
            Validator::make($model->toArray(), $model::getRules())->validate();
        });
    }

    public static function getRules()
    {
        return isset(self::$rules) ? self::$rules : [];
    }
}
