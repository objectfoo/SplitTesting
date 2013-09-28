(function ($, splitTesting) {

    function logger(id) {
        return function (message) {
            splitTesting.logViewedSuccess(id, message);
        };
    }

    function setup(view, click, selector, log) {
        log(view);

        $(selector).one('click', function () {
            log(click);
        });
    }

    function registerCriteria() {
        var hasCoaching    = $('.nextSteps > ol > li.coachingScheduler').length,
            hasEnrollInDha = $(".nextSteps > ol > li.enrollInDHA").length,
            hasUtilizeDha  = $(".nextSteps > ol > li.utilizeDHA").length;

        if (hasCoaching) {
            setup('HQResultsDhaNextStepExpanded_ViewedCoachingScheduler',
                'HQResultsDhaNextStepExpanded_ClickedCoachingScheduler',
                '#scheduleCall',
                logger(7));
        }

        if (hasEnrollInDha) {
            setup('HQResultsDhaNextStepExpanded_ViewedEnrollInDHA',
                'HQResultsDhaNextStepExpanded_ClickedEnrollInDHA',
                '.enrollInDHA .details .toolLink',
                logger(8));
        }

        if (hasUtilizeDha) {
            setup('HQResultsDhaNextStepExpanded_ViewedUtilizeDHA',
             'HQResultsDhaNextStepExpanded_ClickedUtilizeDHA',
             '.utilizeDHA .details .toolLink',
             logger(9));
        }
    }

    $(document).ready(function () {
        function splitTestingSetup() {
            var $firstNextStep;

            if (!splitTesting.isSplitTestingEnabled()) { return; }

            $firstNextStep = $('.nextSteps').find('li').first();

            if ($firstNextStep.hasClass('utilizeDHA') || $firstNextStep.hasClass('enrollInDHA')) {
                registerCriteria();

                if (splitTesting.isSplitTestB()) {
                    $firstNextStep.find('h3').first().click();
                }
            }
        }

        setTimeout(splitTestingSetup, 1000);
    });
} (jQuery, SplitTesting));
