const {naturalLanguage} = require("./googleNLApi");
const soundFXCaller = (function(){
    "use strict";

    let module = {};

    const NOUN = 'NOUN'
    const VERB = 'VERB'

   let dataPreprocessing = async (text) => {
        let data = []
        let morphologyTreeRaw = await naturalLanguage.syntaxAnalysis(text);
        let morphologyTree = morphologyTreeRaw[0];

        morphologyTree.sentences.forEach(sentence => {
            data.push({
                sentence: sentence.text.content,
                charIndex: sentence.text.beginOffset,
                length: sentence.text.content.length,
                words: []
            });
        });

        let index = 0;
        let prevLength = 0;
        let wordCount = 0;
        let mapWordPos = 0;
        morphologyTree.tokens.forEach(token => {
            wordCount += 1;
            if (token.text.beginOffset - prevLength > data[index].length) {
                prevLength += data[index].length + 1;
                index += 1;
                mapWordPos = wordCount;
            }

            data[index].words.push({
                word: token.text.content,
                charIndex: token.text.beginOffset - prevLength,
                tag: token.partOfSpeech.tag,
                number: token.partOfSpeech.number,
                dependencyEdge: {
                    headTokenIndex: (token.dependencyEdge.headTokenIndex - mapWordPos) - 1,
                    label: token.dependencyEdge.label
                }
            });


        });

        return data;
    }

    let configureEntitiesWithContext = async (data) => {
        let entities = {};
        // let entitiesIndex = {};

        // let counter = 0
        for (let i = 0; i < data.length; i++) {
            let word = data[i];
            if (word.tag === NOUN && ['NSUBJ', 'POBJ', 'NN'].includes(word.dependencyEdge.label)) {
                entities[word.word] = {
                    context: [],
                    number: word.number
                }
                // entitiesIndex[i] = counter
                // counter ++
            }
        }

        //TODO: Make use of verbs
        // for (let i = 0; i < data.length; i++) {
        //     let word = data[i];
        //     let indexOfHead = entitiesIndex[word.dependencyEdge.headTokenIndex];
        //     if (word.tag === VERB && indexOfHead !== undefined) {
        //         console.log(word.word, indexOfHead, entities[indexOfHead])
        //         entities[indexOfHead].context = word.word
        //     }
        // }

        return entities
    }

    module.determineSFXCalls = async (text, soundMappings) => {
        let processedData = await dataPreprocessing(text);
        let entities = {};

        for (const sentence of processedData) {
            entities[sentence.sentence] = await configureEntitiesWithContext(sentence.words);
        }

        return entities;
    }

    return module;
})();

module.exports = {soundFXCaller}
