PLAY THE GAME : https://dl.dropboxusercontent.com/u/53655251/LudumDare26/index.html

Created for Ludum Dare 26
http://www.ludumdare.com/compo/
Theme: Minimalism

My first entry to the Ludum Dare contest.
I am very happy to see this game finished :)

Light up the world by passing all its points without hitting death ( red circles ).
By passing already lit point, you put it out.
Movement is 6-way directions:
Q  W  E
 \ | /
 / | \
A  S  D
Power is SPACE, in which that point can not be put out.

Score is determined on number of light points, remaining powers and time spent.
Formula is:
(LIGNT_POINTS - 1) * 100
IF( LIGNT_POINTS > 3) ADD (REMAINING_POWERS * 250)
IF( VICTORY AND TIME_SPENT < 60s ) ADD ( (60s - TIME_SPENT) * 30 )

I used HTML5 canvas as game environment, and since wanted to keep it minimalistic,
wrote simple engine for game (no sprites, particles, and stuff).
jQuery - http://jquery.com/
tween.js - https://github.com/sole/tween.js/
Music loop is downloaded from http://www.looperman.com/loops?gid=21
No graphics :)

Feel free to contact me,
Rongon, http://www.ludumdare.com/compo/author/rongon
or by mail:
minic.sava at gmail.com

All the best