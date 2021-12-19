<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="{{ asset('/vendor/laravel-access-list/bootstrap.min.css') }}" rel="stylesheet">

    <title>Hello, world!</title>
</head>

<body>
    <div class="container mt-5">
        <h1>ACL - {{ env('APP_NAME') }}</h1>
        @yield('container')
    </div>

    <script src="{{ asset('/vendor/laravel-access-list/bootstrap.bundle.min.js') }}"></script>

    {{-- Boostrap table --}}
    <script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>
    <link href="https://unpkg.com/bootstrap-table@1.19.1/dist/bootstrap-table.min.css" rel="stylesheet">
    <script src="https://unpkg.com/tableexport.jquery.plugin/tableExport.min.js"></script>
    <script src="https://unpkg.com/bootstrap-table@1.19.1/dist/bootstrap-table.min.js"></script>
    <script src="https://unpkg.com/bootstrap-table@1.19.1/dist/bootstrap-table-locale-all.min.js"></script>
    <script src="https://unpkg.com/bootstrap-table@1.19.1/dist/extensions/export/bootstrap-table-export.min.js"></script>

    @yield('script')
</body>

</html>
