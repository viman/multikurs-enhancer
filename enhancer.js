"use strict";
var Enhancer = (function () {
    function Enhancer(provider, highlighter, checker, speaker) {
        this.provider = provider;
        this.highlighter = highlighter;
        this.checker = checker;
        this.speaker = speaker;
        this.provider = provider;
        this.highlighter = highlighter;
        this.checker = checker;
        this.speaker = speaker;
    }
    Enhancer.prototype.enhance = function () {
        var parentBinding = window.doBinding;
        window.doBinding = function () {
            parentBinding();
            this.resetTranslationStyle();
            this.enhanceTranslationCheck();
            this.enhanceSpeaker();
        };
        window.checkTranslation = this.enhanceTranslationCheck;
        this.enhanceSearch();
    };
    Enhancer.prototype.enhanceSearch = function () {
        $('#word_search_input').keypress(function (e) {
            if (e.which == 13) {
                window.word_search();
            }
        });
    };
    Enhancer.prototype.enhanceTranslationCheck = function () {
        var translationCheck;
        if (!this.provider.isAnswerScreen()) {
            return;
        }
        translationCheck = this.checker.checkTranslation();
        this.highlighter.highlightTranslation(translationCheck);
        if (translationCheck.synonymGuessed) {
            this.highlighter.highlightSynonym(translationCheck);
        }
        this.highlighter.highlightButton(translationCheck);
    };
    Enhancer.prototype.enhanceSpeaker = function () {
        if (this.provider.isAnswerScreen() && !this.provider.hasPlayButton()) {
            var previousElement = this.provider.get$transcription().length ? this.provider.get$transcription() : this.provider.get$foreignWord();
            previousElement.after($('<a/>', {
                'class': 'PlayButton key_q key_semicolon',
                style: 'display:inline-block;margin:0px 5px;position:relative;top:1px;',
                title: 'Odtwórz nagranie',
                on: {
                    click: function () {
                        this.speaker.say(this.provider.getForeignWord());
                    }
                }
            }));
            this.speaker.say(this.provider.getForeignWord());
        }
    };
    Enhancer.prototype.resetTranslationStyle = function () {
        this.provider.setTranslationAttr({ autocomplete: 'off' });
        this.highlighter.resetTranslationStyle();
    };
    return Enhancer;
}());
exports.Enhancer = Enhancer;
