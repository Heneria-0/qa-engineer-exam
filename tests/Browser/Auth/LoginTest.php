<?php
// tests/Browser/Auth/NoUserLoginTest.php

namespace Tests\Browser\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function setUp(): void{

        parent::setUp();
        $this->artisan('db:seed');
    }

    /** @test */
    public function test_Login_Page_Elements_Presence()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login') 
                    ->assertVisible('input[name="email"]')
                    ->assertVisible('input[name="password"]')
                    ->assertVisible('button[type="submit"]');
        });
    }

    /** @test */
    public function test_Login_Page_Elements_Values()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->assertInputValue('input[name="email"]', '')
                    ->assertInputValue('input[name="password"]', '')
                    ->assertSeeIn('button[type="submit"]', 'Sign In');

        });
    }

    /** @test */
    public function test_Interacting_With_Form()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->type('email', 'test@example.com')
                    ->type('password', 'secret')
                    ->press('Sign In')
                    ->assertPathIs('/login'); // Since no user exists, it should stay on the login page
        });
    }

   /** @test */
    public function test_Login_Failure_With_Non_Existent_User()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->type('email', 'nonexistent@example.com')
                    ->type('password', 'password123')
                    ->press('Sign In')
                    ->assertPathIs('/login')
                    ->assertSee('These credentials do not match our records.');
        });
    }

    /** @test */
    public function test_Login_Failure_With_Empty_Fields()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->press('Sign In')
                    ->assertPathIs('/login')
                    ->assertSee('The email field is required.')
                    ->assertSee('The password field is required.');
        });
    }

    /** @test */

    public function test_Login_Failure_With_Only_Password()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->type('password', 'password')
                    ->press('Sign In')
                    ->assertPathIs('/login')
                    ->assertSee('The email field is required.');
        });
    }

     /** @test */

    public function test_Login_Failure_With_Only_Email()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                    ->type('email', 'admin@admin.com')
                    ->press('Sign In')
                    ->assertPathIs('/login')
                    ->assertSee('The password field is required.');
        });
    }

    /** @test */

    public function test_assert_if_not_check()
    {
        $this->browse(function (Browser $browser) {
            // Navigate to the login page
            $browser->visit('/login');

            // Assert that the "Remember Me" checkbox is not checked by default
            $browser->assertNotChecked('input[name="remember"]');
        });

    }





 

}
