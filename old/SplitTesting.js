/**
	AB_TEST_IDs = {
		0: ['HQResultsCoachingNextStepExpanded_ViewedCoachingScheduler','HQResultsCoachingNextStepExpanded_ClickedCoachingScheduler'],
		1: ['HQResultsCoachingNextStepExpanded_ViewedEnrollInDHA',		'HQResultsCoachingNextStepExpanded_ClickedEnrollInDHA' ],
		2: ['HQResultsCoachingNextStepExpanded_ViewedUtilizeDHA',		'HQResultsCoachingNextStepExpanded_ClickedUtilizeDHA'] 

		3: 'ChallengesMessageMyTeam_FromLeaderboard',
		4: 'ChallengesMessageMyTeam_FromMessages'
		5: 'ChallengesMessageMyTeam_SentMessageFromLeaderboard'
		6: 'ChallengesMessageMyTeam_SentMessageFromMessages'

		7: ['HQResultsDhaNextStepExpanded_ViewedCoachingScheduler',	'HQResultsDhaNextStepExpanded_ClickedCoachingScheduler'],
		8: ['HQResultsDhaNextStepExpanded_ViewedEnrollInDHA',		'HQResultsDhaNextStepExpanded_ClickedEnrollInDHA'],
		9: ['HQResultsDhaNextStepExpanded_ViewedUtilizeDHA',		'HQResultsDhaNextStepExpanded_ClickedUtilizeDHA']
	}
*/
/*global jQuery*/
var SplitTesting = (function (st, $) {
	var splitTestA = "A";
	var splitTestB = "B";

	var buildLoggingData = function (splitTestingId, splitTestingName) {
		var antiForgeryToken = $("input[name=__RequestVerificationToken]").first().serialize();
		var data = "splitTestingId=" + splitTestingId;
		if (typeof (splitTestingName) === "string") {
			data += "&splitTestingDescription=" + splitTestingName;
		}
		return data + "&" + antiForgeryToken;
	};

	var logSplitTestEvent = function (ajaxEndpoint, splitTestingId, splitTestingName) {
		var dataToLog = buildLoggingData(splitTestingId, splitTestingName);
		$.ajax({
			type: "POST",
			url: ajaxEndpoint,
			data: dataToLog,
			dataType: "json",
			cache: "false"
		});
	};

	var splitTest;
	var getSplitTest = function () {
		if (!splitTest) {
			splitTest = "";
			if ($(".splitTestA").length > 0) {
				splitTest = splitTestA;
			} else if ($(".splitTestB").length > 0) {
				splitTest = splitTestB;
			}
		}
		return splitTest;
	};

	st.isSplitTestingEnabled = function () {
		return getSplitTest().length > 0;
	};

	st.isSplitTestA = function () {
		return getSplitTest() === splitTestA;
	};

	st.isSplitTestB = function () {
		return getSplitTest() === splitTestB;
	};

	st.logViewedSuccess = function (splitTestingId, splitTestingName) {
		var logViewedSuccessUrl = "/UI/SplitTesting.aspx/ViewedSuccess";
		logSplitTestEvent(logViewedSuccessUrl, splitTestingId, splitTestingName);
	};

	st.logSuccess = function (splitTestingId, splitTestingName) {
		var logSuccessUrl = "/UI/SplitTesting.aspx/Success";
		logSplitTestEvent(logSuccessUrl, splitTestingId, splitTestingName);
	};

	return st;
} (SplitTesting || {}, jQuery));