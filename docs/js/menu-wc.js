'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ng-magic-test-bed-presentation documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link">ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SampleComponent.html" data-type="entity-link">SampleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TodoItemComponent.html" data-type="entity-link">TodoItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TodoListComponent.html" data-type="entity-link">TodoListComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/HandlerDirective.html" data-type="entity-link">HandlerDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/OverdueHighlightDirective.html" data-type="entity-link">OverdueHighlightDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/NgMagicSetupTestBed.html" data-type="entity-link">NgMagicSetupTestBed</a>
                            </li>
                            <li class="link">
                                <a href="classes/NgMagicTestBed.html" data-type="entity-link">NgMagicTestBed</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpyObserver.html" data-type="entity-link">SpyObserver</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestBedConfigurator.html" data-type="entity-link">TestBedConfigurator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Todo.html" data-type="entity-link">Todo</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ExampleService.html" data-type="entity-link">ExampleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelperService.html" data-type="entity-link">HelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IdGeneratorService.html" data-type="entity-link">IdGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyComponentService.html" data-type="entity-link">MyComponentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyService.html" data-type="entity-link">MyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TodoFactory.html" data-type="entity-link">TodoFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TodoService.html" data-type="entity-link">TodoService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FullTestModuleMetadata.html" data-type="entity-link">FullTestModuleMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFactory.html" data-type="entity-link">IFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHandler.html" data-type="entity-link">IHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISerializedTodo.html" data-type="entity-link">ISerializedTodo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITodoInitParam.html" data-type="entity-link">ITodoInitParam</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/DueInPipe.html" data-type="entity-link">DueInPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});