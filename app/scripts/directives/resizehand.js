'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:resizeHand
 * @description
 * # resizeHand
 */
angular.module('grafterizerApp')
  .directive('resizeHand', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var target = document.getElementById(attrs.
          for);
        if (!target) return;

        if (window.requestAnimationFrame) {
          var requestAnim = 0;
          var mousemove = function(e) {
            if (!requestAnim) {
              requestAnim = window.requestAnimationFrame(function() {
                updateLayout(e.offsetX);
                requestAnim = 0;
              });
            }
          };
        } else {
          var mousemove = _.throttle(function() {
            updateLayout(e.offsetX);
          }, 1 / 2000);
        }

        var savedW = 0;
        var updateLayout = function(w)  {
          if (window.innerWidth < 600) {
            element.css('display', 'none');
            target.setAttribute('flex', '');
            return;
          }

          element.css('display', 'block');
          target.removeAttribute('flex');

          w = Math.max(Math.round(w), 300);
          element.css('left', (w - 3) + 'px');
          element.css('height', target.clientHeight + 'px');
          target.style.width = w + 'px';
          savedW = w;

          if (window.sessionStorage) {
            window.sessionStorage.setItem('resizeHand' + attrs.for, w);
          }
        };

        window.addEventListener('resize', function() {
          mousemove({
            offsetX: savedW
          });
        });

        var initLayout = function() {
          var key = 'resizeHand' + attrs.for;
          var width = window.sessionStorage && window.sessionStorage.hasOwnProperty(key) ?
            parseInt(window.sessionStorage.getItem(key)) : window.innerWidth / 2;
           
          updateLayout(width);
        };

        initLayout();
        window.setTimeout(initLayout, 1000);

        var mask = document.createElement('div');
        mask.className = 'resize-hand-mask';

        var isDragging = false;
        element.on('mousedown', function(ev) {
          isDragging = true;
          element.parent().append(mask);
          mask.addEventListener('mousemove', mousemove);
        });

        var stopDrag = function() {
          if (isDragging) {
            mask.removeEventListener('mousemove', mousemove);
            element[0].parentNode.removeChild(mask);
            isDragging = false;
          }
        };

        mask.addEventListener('mouseup', stopDrag);
        mask.addEventListener('mouseleave', stopDrag);

        scope.$on('$destroy', function() {
          target.setAttribute('flex', '');
          target.style.width = '';
        });
      }
    };
  });
