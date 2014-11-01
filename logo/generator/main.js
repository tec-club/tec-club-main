window.TECUtils = {
	repeatString: function repeatString(str, num) {
		var repStr = '';
		for (var i = num - 1; i >= 0; i--) {
			repStr += str;
		}
		return repStr;
	},

	daysOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	getDayOfWeek: function getDayOfWeek(date) {
		return this.daysOfWeek[date.getDay()];
	}
}

angular.module('tecClubGenerator', [])
	.controller('tecClubGeneratorCtrl', function ($scope) {
		$scope.Date = function(arg){
			return new Date(arg || new Date());
		};
	})
	.directive('tecClubCanvas', function tecClubCanvasDirective() {
		return {
			restrict: 'E',
			scope: {
				edgeGradient: '=',
				centerGradient: '=',
				number: '=',
				tagline: '=',
				date: '=',
				location: '=',
				lastline: '='
			},
			template: '<canvas></canvas>',
			link: function tecClubCanvasLink (scope, element, attrs) {
				var canvas = element.find('canvas')[0],
					context = canvas.getContext('2d');
				var width = element[0].offsetWidth,
					height = element[0].offsetHeight;
				canvas.width = width;
				canvas.height = height;
				var runs = 0;
				function tecClubCanvasLinkDraw() {
					// Reset
					context.textAlign = 'left';
					context.clearRect(0, 0, width, height);
					// Draw Background
					var bgGradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2 * 1.41421356);
				    bgGradient.addColorStop(0, scope.centerGradient);
				    bgGradient.addColorStop(1, scope.edgeGradient);
					context.fillStyle = bgGradient;
					context.fillRect(0, 0, width, height);
					// Setup Variables
					var tecTextHeight = height / (10 / 3),
						tecOffset = height / 2,
						curlyBraceHeight = tecTextHeight * (10 / 9),
						curlyBraceOffset = tecOffset * (2 / 1.9),
						workshopNumberHeight = height / 16,
						workshopNumberOffset = curlyBraceOffset * (10 / 9),
						infoTextHeight = height / 24,
						infoLineHeight = infoTextHeight + infoTextHeight / 4,
						infoOffset = workshopNumberOffset + infoLineHeight * 1.5;
					// Draw TEC Club text
					context.fillStyle = 'white';
					context.font = 'bold ' + tecTextHeight + 'px Open Sans';
					var tecTextWidth = context.measureText('TEC').width;
					context.fillText('TEC', width / 2 - tecTextWidth / 2, tecOffset);
					// Draw curly braces
					context.font = 'bold ' + curlyBraceHeight + 'px Open Sans';
					context.fillText('}', width / 2 + tecTextWidth / 2, curlyBraceOffset);
					context.textAlign = 'right';
					context.fillText('{', width / 2 - tecTextWidth / 2, curlyBraceOffset);
					// Draw 'Coding Workshop #'
					context.font = '' + workshopNumberHeight + 'px Playball';
					context.textAlign = 'center';
					context.fillText('Coding Workshop ' + scope.number, width / 2, workshopNumberOffset);
					// Draw Tagline
					context.font = 'bold ' + infoTextHeight + 'px Open Sans';
					context.textAlign = 'center';
					context.fillText(scope.tagline, width / 2, infoOffset);
					// Draw Time and Date
					var date = new Date(scope.date + 'T22:00');
					context.fillText('Lunch, ' + TECUtils.getDayOfWeek(date) + ' ' + (date.getMonth() + 1) + '/' + date.getDate(), width / 2, infoOffset + infoLineHeight);
					// Draw Location
					context.fillText(scope.location, width / 2, infoOffset + infoLineHeight * 2);
					// Draw Last Line
					context.fillText(scope.lastline, width / 2, infoOffset + infoLineHeight * 3);
					// Increment runs
					runs++;
				}
				function watchVarForRedraw(varName) {
					scope.$watch(varName, function (newVal, oldVal) {
						if (newVal !== oldVal) {
							tecClubCanvasLinkDraw();
						}
					});
				}
				watchVarForRedraw('centerGradient');
				watchVarForRedraw('edgeGradient');
				watchVarForRedraw('number');
				watchVarForRedraw('tagline');
				watchVarForRedraw('date');
				watchVarForRedraw('location');
				watchVarForRedraw('lastline');
				// Loading display
				var start = new Date(),
					delay = 2000;
				function tecClubCanvasLinkLoading() {
					var sinceStart = new Date() - start;
			        context.clearRect(0, 0, width, height);
					context.font = 'bold 18px ' + (sinceStart < delay / 2 ? 'Open Sans' : 'Playball');
					context.textAlign = 'center';
					var dots = TECUtils.repeatString('.', Math.round(sinceStart / 300) % 4)
					context.fillText('Loading' + dots, width / 2, height / 2);
					if (sinceStart < delay) {
						requestAnimationFrame(tecClubCanvasLinkLoading);
					} else if (runs < 1) {
						tecClubCanvasLinkDraw();
					}
				}
				tecClubCanvasLinkLoading();
			}
		}
	});