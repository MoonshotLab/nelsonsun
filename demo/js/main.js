/* The main Application controller
/********************************/

function Application() {
    // Initialize
    this.current_view = 'start';
    this.countdown = new Countdown();
    this.timer = new Timer();
    this.spinner = new Spinner(this);
    this.power_values = [];
    this.average_power = 0;

    // Bind keypresses
    var obj = this;
    $(document).keypress(function(e) {
        switch (e.keyCode) {
            case 13:
            case 32:
                obj.next_view();
                break;
        }
    });
}

Application.prototype.next_view = function() {
    // Advance through the application
    var obj = this;
    switch (obj.current_view) {
        case 'start':
            obj.current_view = 'countdown';
            $('.start').hide();
            $('.countdown').fadeIn();
            obj.countdown.start();
            setTimeout(function() {
                $('.countdown').hide();
                $('.cranking').fadeIn();
                obj.current_view = 'cranking';
                obj.timer.start();
                obj.spinner.enable();
            }, 4000);
            setTimeout(function() {
                obj.spinner.disable();
            }, 19000);
            setTimeout(function() {
                $('.cranking').fadeOut();
            }, 21000);
            setTimeout(function() {
                $('.result').fadeIn();
                obj.current_view = 'result';
                obj.average_power = parseInt(obj.power_values.reduce(function(a, b) { return a + b; }, 0) /  obj.power_values.length);
                $('.result').html(obj.average_power);
            }, 22000);
            break;
        case 'result':
            $('.result').hide();
            $('.start').fadeIn();
            obj.current_view = 'start';
            break;
    }
}

/* The starting countdown controller
/**********************************/

function Countdown() {
    // Initialize
    this.countdown_el = $('.countdown');
}

Countdown.prototype.start = function() {
    // Begin counting down
    var obj = this;
    obj.countdown_el.html('3');

    setTimeout(function() {
        obj.countdown_el.hide();
        obj.countdown_el.html('2');
        obj.countdown_el.fadeIn();
    }, 1000);

    setTimeout(function() {
        obj.countdown_el.hide();
        obj.countdown_el.html('1');
        obj.countdown_el.fadeIn();
    }, 2000);

    setTimeout(function() {
        obj.countdown_el.hide();
        obj.countdown_el.html('Go.');
        obj.countdown_el.fadeIn();
    }, 3000);
}

/* The cranking Timer controller
/******************************/

function Timer() {
    // Initialize
    this.timer_el = $('.cranking .timer');
    this.start_time = 0;
    this.interval;
}

Timer.prototype.start = function() {
    // Begin counting down
    var obj = this;
    obj.start_time = new Date().getTime();

    $('span:nth-child(1)', obj.timer_el).html('15');
    $('span:nth-child(2)', obj.timer_el).html('000');

    obj.interval = setInterval(function() {
        var diff = 15000-(new Date().getTime() - obj.start_time);
        $('span:nth-child(1)', obj.timer_el).html(parseInt(diff/1000));
        $('span:nth-child(2)', obj.timer_el).html(('000' + diff%1000).substr(-3));
        if (diff <= 0) {
            clearInterval(obj.interval);
            $('span:nth-child(1)', obj.timer_el).html('0');
            $('span:nth-child(2)', obj.timer_el).html('000');
        }
    }, 70);
}


/* The Spinner display controller
/*******************************/

function Spinner(app) {
    // Initialize
    this.position = 0;
    this.hue = 120;
    this.active = false;
    this.app = app;
}

Spinner.prototype.enable = function() {
    // Enable the spinner
    this.active = true;
    this.app.power_values = [];
}

Spinner.prototype.disable = function() {
    // Enable the spinner
    this.active = false;
}

Spinner.prototype.set_position = function(position) {
    // Set the position of the spinner
    if (!this.active) return;
    this.position = position;
    this.app.power_values.push(this.position);
    this.hue = parseInt(120 - this.position * 120 / 180);

    // Transition the css
    $('.spinner .circle').css({
        '-webkit-transform': 'rotate(' + this.position + 'deg)'
    });
    $('.spinner .half-bottom').css({
        'background': 'hsl(' + this.hue + ', 100%, 50%)',
    });

    // Display the power value
    $('.spinner .value').html(parseInt(this.position));
}

/* The controller for Dummy users
/*******************************/

function Dummy(app) {
    // Initialize
    var obj = this;
    obj.target = 90;
    this.app = app;
    this.interval;

    // Set a new target when not cranking
    setInterval(function() {
        if (this.app.current_view !== 'cranking')
        obj.target = Math.random()*100-50+90;
    }, 100);
}

Dummy.prototype.crank = function() {
    // Start cranking
    var obj = this;
    this.interval = setInterval(function() {
        this.app.spinner.set_position(Math.abs(Math.random()*60-30+obj.target)%180);
    }, 300);
}

app = new Application();
dummy = new Dummy(app);
dummy.crank();
