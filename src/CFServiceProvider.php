<?php
/**
 * Module created by request special for uamade.ua
 * @author Shubin Sergie <is.captain.fail@gmail.com>
 * @license GNU General Public License v3.0
 * 05.02.2020 2020
 */

namespace CFGit\LaraPack;


use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\View\Factory;
use Illuminate\Support\ServiceProvider;

class CFServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->publishes([
            ( __DIR__ . '/package.json') => base_path('package.json'),
        ], ['package.json', 'larapack']);
        $this->publishes([
            ( __DIR__ . '/rootfiles') => base_path(),
        ], ['larapack-files', 'larapack']);
        $this->publishes([
            ( __DIR__ . '/resources') => resource_path(),
        ], ['larapack-resources', 'larapack-files', 'larapack']);
        parent::register();
    }
}
