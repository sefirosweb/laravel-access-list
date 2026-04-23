<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_has_acl', function (Blueprint $table) {
            $table->unsignedBigInteger('access_list_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['access_list_id', 'role_id']);
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('access_list_id')->references('id')->on('access_lists')->onDelete('cascade');
        });

        $Role = config('laravel-access-list.Role');
        $AccessList = config('laravel-access-list.AccessList');

        $Role::where('name', 'admin')->first()->access_lists()->attach(
            $AccessList::where('name', 'admin')->first()
        );
        $Role::where('name', 'acl')->first()->access_lists()->attach(
            $AccessList::where('name', 'acl_view')->first()
        );
        $Role::where('name', 'acl')->first()->access_lists()->attach(
            $AccessList::where('name', 'acl_edit')->first()
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('role_has_acl');
    }
};
