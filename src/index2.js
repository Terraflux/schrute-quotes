'use strict';

var APP_ID = "amzn1.echo-sdk-ams.app.3f554bc4-b6c0-448c-baa7-6651cf32ec26";

var SCHRUTE_QUOTES = [
    "Would I ever leave this company? Look, I’m all about loyalty. In fact, I feel like part of what I’m being paid for here is my loyalty. But if there were somewhere else that valued loyalty more highly… I’m going wherever they value loyalty the most.",
    "I am fast. To give you a reference point I am somewhere between a snake and a mongoose… And a panther.",
    "Security in this office park is a joke. Last year I came to work with my spud-gun in a duffel bag. I sat at my desk all day with a rifle that shoots potatoes at 60 pounds per square inch. Can you imagine if I was deranged?",
    "I grew up on a farm. I have seen animals having sex in every position imaginable. Goat on chicken. Chicken on goat. Couple of chickens doing a goat, couple of pigs watching.",
    "Through concentration, I can raise and lower my cholesterol at will.",
    "I come from a long line of fighters. My maternal grandfather was the toughest guy I ever knew. World War II veteran, killed twenty men, and spent the rest of the war in an Allied prison camp. My father battled blood pressure and obesity all his life. Different kind of fight.",
    "As a volunteer Sheriff’s Deputy I’ve been doing surveillance for years. One time I suspected an ex-girlfriend of mine of cheating on me, so I tailed her for six nights straight. Turns out… she was. With a couple of guys actually, so… mystery solved.",
    "And I did not become a Lackawanna County volunteer sheriff’s deputy to make friends. And by the way, I haven’t.",
    "As a farmer I know that when an animal is sick sometimes the right thing to do is put it out of its misery. With the electricity we are using to keep Meredith alive, we could power a small fan for two days. You tell me what’s unethical.",
    "I signed up for Second Life about a year ago. Back then, my life was so great that I literally wanted a second one. Absolutely everything was the same…except I could fly.",
    "People say, ‘oh it’s dangerous to keep weapons in the home, or the workplace.’ Well I say, it’s better to be hurt by someone you know, accidentally, than by a stranger, on purpose.",
    "I wish I could menstruate. If I could menstruate, I wouldn’t have to deal with idiotic calendars anymore. I’d just be able to count down from my previous cycle. Plus I’d be more in tune with the moon and the tides.",
    "Once I’m officially Regional Manager, my first order of business will be to demote Jim Halpert. So I will need a new number two. My ideal choice? Jack Bauer. But he is unavailable. Fictional. And overqualified.",
    "In the wild, there is no healthcare. Healthcare is “Oh, I broke my leg!” A lion comes and eats you, you’re dead. Well, I’m not dead, I’m the lion, you’re dead!",
    "Congratulations on your one cousin. I have seventy, each one better than the last!",
    "Now that I own the building I’m looking for new sources of revenue. And a daycare center? Muahahahahahahahaha…Well I guess it’s not an evil idea, it’s just a regular idea, but there’s no good laugh for a regular idea.",
    "The principle is sound. To avoid illness, expose yourself to germs, enabling your immune system to develop antibodies. I don’t know why everyone doesn’t do this… Maybe they have something against living forever.",
    "It’s never the person who you most suspect. It’s also never the person you least suspect since anyone with half a brain would suspect them the most. Therefore, I know the killer to be Phyllis… The person who I most medium suspect.",
    "No, don’t call me a hero. Do you know who the real heroes are? The guys who wake up every morning and go into their normal jobs, and get a distress call from the Commissioner and take off their glasses and change into capes and fly around fighting crime. Those are the real heroes.",
    "It’s a real shame because studies have shown that more information gets passed through water cooler gossip than through official memos. Which puts me at a disadvantage because I bring my own water to work.",
    "Nothing stresses me out. Except having to seek the approval of my inferiors.",
    "Why are all these people here? There are too many people on this earth. We need a new plague.",
    "No, I disagree. “R” is one of the most menacing of sounds. That’s why they call it murder not ‘muckduck’.",
    "Reject a woman, and she will never let it go. One of the many defects of their kind. Also, weak arms.",
    "I don’t have a lot of experience with vampires, but I have hunted werewolves. I shot one once, but by the time I got to it, it had turned back into my neighbor’s dog.",
    "In an ideal world, I would have all 10 fingers on my left hand so my right hand could just be a fist for punching.",
    "You couldn’t handle my undivided attention.",
    "I saw Wedding Crashers accidentally. I bought a ticket for “Grizzly Man” and went into the wrong theater. After an hour, I figured I was in the wrong theater, but I kept waiting. Cuz that’s the thing about bear attacks… they come when you least expect it.",
    "Of course Martial arts training is relevant… Uh, I know about a billion Asians that would beg to differ… You know what, you can go to hell, and I will see you there. Burning!",
    "There are a huge number of yeast infections in this county. Probably because we’re downriver from that old bread factory.",
    "Bears, Beets, Battlestar Galactica."
];

exports.handler = function(event, context){
	try {
        console.log("session applicationId: " + event.session.application.applicationId);

        if (event.session.application.applicationId !== APP_ID) {
        	context.fail("Invalid Application ID");
        }

        if (!event.session.attributes) {
            event.session.attributes = {};
        }

        if (event.session.new) {
        	onSessionStarted(event.request, event.session);
        }

        if (event.request.type === "LaunchRequest") {
        	onLaunch(event.request,
        		event.session,
        		function callback(sessionAttributes, speechletResponse) {
        			context.succeed(buildResponse(sessionAttributes, speechletResponse));
        		});
        } else if (event.request.type === "IntentRequest") {
        	onIntent(event.request,
        		event.session,
        		function callback(sessionAttributes, speechletResponse) {
        			context.succeed(buildResponse(sessionAttributes, speechletResponse));
        		});
        } else if (event.request.type === "SessionEndedRequest") {
        	onSessionEnded(event.request, event.session);
        	context.succeed();
        }
    } catch (e) {
    	context.fail("Exception: " + e);
    }
};

function onSessionStarted(sessionStartedRequest, session) {
	console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
	console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);
	handleNewQuoteRequest(callback);
}

function onIntent(intentRequest, session, callback) {
	console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

	var intent = intentRequest.intent;
	var intentName = intentRequest.intent.name;

	if ("GetNewQuoteIntent" === intentName){
		handleQuoteRequest(intent, session, callback);
	} else if ("AMAZON.HelpIntent" === intentName) {
		handleHelpRequest(intent, session, callback);
	} else if ("AMAZON.StopIntent" === intentName) {
		handleEndSessionRequest(intent, session, callback);
	} else if ("AMAZON.CancelIntent" === intentName) {
		handleEndSessionRequest(intent, session, callback);
	} else {
		throw "Invalid intent";
	}
}

function onSessionEnded(sessionEndedRequest, session) {
	console.log("SchruteQuotes onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
}

function handleQuoteRequest(intent, session, callback) {
	var quoteIndex = Math.floor(Math.random() * SCHRUTE_QUOTES.length);
	var quote = SCHRUTE_QUOTES[quoteIndex];
	var speechOutput = quote;
	callback(session.attributes, quote)
}

function handleHelpRequest(intent, session, callback) {
	callback(session.attributes, "Ask Schrute Quotes for a Schrute Quote by saying tell me a Schrute Quote.")
}

function handleEndSessionRequest(intent, session, callback) {
	callback(session.attributes, "The beet farm is closing.")
}

function buildResponse(sessionAttributes, speechletResponse) {
	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	};
}