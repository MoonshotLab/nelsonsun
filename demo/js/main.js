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
                $('.result .crank-output .watts').html(obj.average_power);
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

var power_vals = [113.30663409549743, 136.3994489889592, 87.29838035069406, 90.0683429185301, 132.1836061682552, 98.52062781341374, 100.61891928315163, 126.09749300405383, 84.83293887693435, 133.92702754121274, 124.80104346293956, 91.25170035753399, 111.0621779365465, 106.50015646591783, 139.45679519325495, 101.70422218739986, 103.33387285936624, 140.4692861950025, 111.02274627890438, 133.40604013763368, 105.60755583457649, 143.39465405326337, 128.7309704720974, 103.14886725507677, 89.57110065035522, 108.340661553666, 87.07589487079531, 92.81369468197227, 140.95127225387841, 87.76948004961014, 110.26647571008652, 108.56794138439, 85.01459334045649, 119.10673609003425, 137.27998850867152, 94.2639915831387, 120.376111343503, 120.84500058088452, 87.05437943339348, 85.51547691691667, 135.74278054758906, 140.36607669200748, 141.26849408261478, 133.59461453277618, 123.57107825577259, 115.16920922324061];
