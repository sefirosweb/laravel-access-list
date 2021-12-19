<?php

Route::group(['namespace' => 'Sefirosweb\LaravelAccessList\Http\Controllers'], function () {
    Route::get('acl', 'UserController@index');
});
