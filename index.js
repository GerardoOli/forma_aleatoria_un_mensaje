/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const i18n = require('i18next')
const sprintf = require('i18next-sprintf-postprocessor')

const languageStrings = {  
    en: {
        translation: {
            WELCOME_MESSAGE: 'Hello! To start, just say: tell me about Nata. Tell me a fun fact about Nata. Or if you want to cancel just say Cancel!',
            HELLO_MESSAGE: 'Hello World! Gerardo',
            HELP_MESSAGE: 'You can say hello to me! How can I help Gerardo?',
            GOODBYE_MESSAGE: 'Goodbye! Gerardo',
            REFLECTOR_MESSAGE: 'You just triggered %s',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again Gerardo.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again Gerardo.',
            GET_FACT_MSG: 'A fun fact is ...',
            FACTS: [
                "The oldest champion in League of Legends is Singed, one of the first to be designed.",
                "Teemo is one of the most hated and at the same time most beloved champions by the community.",
                "League of Legends has over 140 playable champions.",
                "The most played map is Summoner's Rift.",
                "The mascot of Riot Games, the creator of League of Legends, is a Poro.",
                "Faker, whose real name is Sang-hyeok Lee, is considered the best League of Legends player of all time.",
                "Every year, the League of Legends World Championship, known as Worlds, is held.",
                "The first champion created exclusively for the League of Legends universe was Ryze."
            ]
        }
    },  
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Hola! Para poder empezar solo di: cuéntame sobre el Nata. Dime un dato curioso del Nata. O si deseas cancelar solo di ¡Cancela!',
            HELLO_MESSAGE: '¡Hola Mundo! Gerardo',
            HELP_MESSAGE: 'Puedes decirme hola. ¿Cómo te puedo ayudar Gerardo?',
            GOODBYE_MESSAGE: '¡Adiós! Gerardo',
            REFLECTOR_MESSAGE: 'Acabas de activar %s',
            FALLBACK_MESSAGE: 'Lo siento, no sé nada sobre eso. Por favor inténtalo otra vez Gerardo.',
            ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez Gerardo.',
            GET_FACT_MSG: 'Un dato curioso es ...',
            FACTS: [
                "El campeón más antiguo de League of Legends es Singed, uno de los primeros en ser diseñado.",
                "Teemo es uno de los campeones más odiados y a la vez más queridos por la comunidad.",
                "League of Legends tiene más de 140 campeones jugables.",
                "El mapa más jugado es la Grieta del Invocador.",
                "La mascota de Riot Games, el creador de League of Legends, es un Poro.",
                "Faker, cuyo nombre real es Sang-hyeok Lee, es considerado el mejor jugador de League of Legends de todos los tiempos.",
                "Cada año, se celebra el Campeonato Mundial de League of Legends, conocido como Worlds.",
                "El primer campeón creado exclusivamente para el universo de League of Legends fue Ryze."
    ],
        }
    }
};

// Localization interceptor
// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELLO_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RandomFactIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RandomFactIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const fra = requestAttributes.t('FACTS');
        const Indice = Math.floor(Math.random() * fra.length);
        const frase = fra[Indice];
        const speakOutput = `${frase}... Quieres volver a intentarlo?...`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};



exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        RandomFactIntent,
        IntentReflectorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();