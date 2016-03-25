/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Schrute Quotes for a schrute quote"
 *  Alexa: "Here's your schrute quote: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.3f554bc4-b6c0-448c-baa7-6651cf32ec26"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing schrute Quotes.
 */
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
    "There are a huge number of yeast infections in this county. Probably because we’re downriver from that old bread factory."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SchruteQuotes is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SchruteQuotes = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SchruteQuotes.prototype = Object.create(AlexaSkill.prototype);
SchruteQuotes.prototype.constructor = SchruteQuotes;

SchruteQuotes.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SchruteQuotes onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SchruteQuotes.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SchruteQuotes onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SchruteQuotes.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SchruteQuotes onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SchruteQuotes.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Schrute Quotes tell me a schrute quote, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new quote from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random schrute quote from the schrute Quotes list
    var factIndex = Math.floor(Math.random() * SCHRUTE_QUOTES.length);
    var quote = SCHRUTE_QUOTES[factIndex];

    // Create speech output
    var speechOutput = "Here's your schrute quote: " + quote;

    response.tellWithCard(speechOutput, "SchruteQuotes", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SchruteQuotes skill.
    var SchruteQuotes = new SchruteQuotes();
    SchruteQuotes.execute(event, context);
};

