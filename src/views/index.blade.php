<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ config('app.name') }} - ACL System</title>
</head>

<body>
    <div id="root"></div>
    <script>
        window.APP_PREFIX = '{{ config('laravel-access-list.prefix') }}'
        window.APP_URL = '{{ config('app.url') }}/' + APP_PREFIX
    </script>

    {{ Vite::useHotFile(storage_path('app/vite_acl.hot'))
    // ->useBuildDirectory('bundle')
    // ->useManifestFilename('assets.json')
    ->withEntryPoints(['resources/js/app.tsx']) }}
</body>

</html>