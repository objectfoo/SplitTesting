(function ($, splitTesting) {

    var scheduleCallTestId = 7;
    var enrollInDhaTestId = 8;
    var utilizeDhaTestId = 9;

    var registerSuccessCriteria = function() {

        var $coachingInNextSteps = $('.nextSteps > ol > li.coachingScheduler');
        if ( $coachingInNextSteps.length === 1 ) {
            splitTesting.logViewedSuccess(scheduleCallTestId, "HQResultsDhaNextStepExpanded_ViewedCoachingScheduler");
            $("#schedulecall").one("click", function() {
                splitTesting.logSuccess(scheduleCallTestId, "HQResultsDhaNextStepExpanded_ClickedCoachingScheduler");
            });
        }

        var $enrollInDhaNextStep = $(".nextSteps > ol > li.enrollInDHA");
        if ($enrollInDhaNextStep.length === 1) {
            splitTesting.logViewedSuccess(enrollInDhaTestId, "HQResultsDhaNextStepExpanded_ViewedEnrollInDHA");
            $(".enrollInDHA .details .toolLink").one("click", function() {
                splitTesting.logSuccess(enrollInDhaTestId, "HQResultsDhaNextStepExpanded_ClickedEnrollInDHA");
            });
        }

        var $utilizeDhaNextStep = $(".nextSteps > ol > li.utilizeDHA");
        if ($utilizeDhaNextStep.length === 1) {
            splitTesting.logViewedSuccess(utilizeDhaTestId, "HQResultsDhaNextStepExpanded_ViewedUtilizeDHA");
            $(".utilizeDHA .details .toolLink").one("click", function() {
                splitTesting.logSuccess(utilizeDhaTestId, "HQResultsDhaNextStepExpanded_ClickedUtilizeDHA");
            });
        }
    };

    $(document).ready(function() {
        var splitTestingSetup = function () {
            var $firstNextStep;

            if ( !splitTesting.isSplitTestingEnabled() ) {
                return;
            }
            $firstNextStep = $('.nextSteps').find('li').first();

            if( $firstNextStep.hasClass('utilizeDHA') || $firstNextStep.hasClass('enrollInDHA')) {
                registerSuccessCriteria();

                if ( splitTesting.isSplitTestB() ) {
                    $firstNextStep.find('h3').first().click();
                }
            }
        };

        setTimeout(splitTestingSetup, 1000);
    });
} (jQuery, SplitTesting));
