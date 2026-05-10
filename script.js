(function () {
    'use strict';

    // ==============================
    // ELEMENTS
    // ==============================
    var tapStart = document.getElementById('tap-start');
    var loader = document.getElementById('loader');
    var flash = document.querySelector('.loader-flash');
    var app = document.getElementById('app');
    var lines = document.querySelectorAll('.loader-line');
    var dots = document.querySelectorAll('.loader-dot');
    var final = document.querySelector('.loader-final');
    var music = document.getElementById('music');
    var heroVideo = document.querySelector('.hero-bg-video');

    document.body.classList.add('locked');

    // ==============================
    // TAP TO START
    // Mobile requires user gesture to play audio
    // ==============================
    tapStart.addEventListener('click', function () {
        // Start music very quietly
        music.volume = 0;
        music.play().catch(function() {});

        // Start video
        if (heroVideo) heroVideo.play().catch(function() {});

        // Hide tap screen, show loader
        tapStart.classList.add('gone');
        loader.style.display = 'flex';

        // Begin the loading sequence synced with music
        setTimeout(startLoaderSequence, 500);
    });

    // ==============================
    // MUSIC FADE-IN CONTROLLER
    // Gradually increases volume in steps
    // ==============================
    function fadeInMusic(targetVol, duration) {
        var startVol = music.volume;
        var diff = targetVol - startVol;
        var steps = 30;
        var stepTime = duration / steps;
        var currentStep = 0;

        var interval = setInterval(function () {
            currentStep++;
            music.volume = Math.min(startVol + (diff * (currentStep / steps)), 1);
            if (currentStep >= steps) clearInterval(interval);
        }, stepTime);
    }

    // ==============================
    // LOADER FLASH
    // ==============================
    function doFlash() {
        flash.classList.remove('flash');
        void flash.offsetWidth;
        flash.classList.add('flash');
    }

    // ==============================
    // LOADING SEQUENCE (synced with music beat)
    // Music starts soft, builds with each text slam
    // ==============================
    function startLoaderSequence() {
        // Music fade: whisper quiet at start
        fadeInMusic(0.08, 400);

        var timeline = [
            // "ESTO NO ES" — first beat hit
            { time: 400, fn: function () {
                lines[0].classList.add('show');
                doFlash();
                fadeInMusic(0.15, 500);
            }},
            // "UNA FIESTA" — second hit, louder
            { time: 1000, fn: function () {
                lines[1].classList.add('show');
                doFlash();
                fadeInMusic(0.3, 500);
            }},
            // "NORMAL" — third hit, building
            { time: 1600, fn: function () {
                lines[2].classList.add('show');
                doFlash();
                fadeInMusic(0.45, 400);
            }},
            // Dots — suspense, music holds
            { time: 2200, fn: function () { dots[0].classList.add('show'); } },
            { time: 2400, fn: function () { dots[1].classList.add('show'); } },
            { time: 2600, fn: function () { dots[2].classList.add('show'); } },
            // Clear text
            { time: 3000, fn: function () {
                lines.forEach(function (l) { l.classList.add('hide'); });
                dots.forEach(function (d) { d.style.opacity = '0'; });
            }},
            // CASINO NIGHT reveal — big drop, music goes UP
            { time: 3500, fn: function () {
                doFlash();
                final.classList.add('show');
                fadeInMusic(0.7, 800);
            }},
            // Extra flash for impact
            { time: 3800, fn: function () { doFlash(); } },
            // DONE — full volume, show the invitation
            { time: 4500, fn: function () {
                loader.classList.add('done');
                app.classList.add('visible');
                document.body.classList.remove('locked');
                fadeInMusic(1.0, 2000); // music reaches full volume
            }}
        ];

        timeline.forEach(function (step) {
            setTimeout(step.fn, step.time);
        });
    }

    // ==============================
    // SCROLL REVEAL
    // ==============================
    var reveals = document.querySelectorAll('.reveal');

    function checkReveal() {
        for (var i = 0; i < reveals.length; i++) {
            var el = reveals[i];
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                el.classList.add('visible');
            }
        }
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('load', checkReveal);
    setTimeout(checkReveal, 100);

})();
