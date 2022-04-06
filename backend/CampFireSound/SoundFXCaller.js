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

        for (let i = 0; i < data.length; i++) {
            let word = data[i];
            if (word.tag === NOUN || word.tag === VERB) {
                entities[word.word.toLowerCase()] = {
                    context: [],
                    number: word.number
                }
            }
        }

        return entities
    }

    module.determineSFXCalls = async (text, callback) => {
        let processedData = await dataPreprocessing(text);

        for (const sentence of processedData) {
            callback(await configureEntitiesWithContext(sentence.words));
        }
    }

    return module;
})();

module.exports = {soundFXCaller}
