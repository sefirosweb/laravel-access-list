<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Http\Traits;

trait UsesCustomModel
{
    protected static $customModel = self::class;

    public static function use(string $model)
    {
        static::$customModel = $model;
    }

    public function newCustomModel()
    {
        $class = static::$customModel;

        return new $class;
    }
}
