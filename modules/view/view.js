const VIEWS = [];

class ViewController {
    constructor() {
        this.enableToViewButtons();
    }

    setView(viewName) {
        if (this.activeView) {
            this.activeView.deactivate();
        }

        const view = VIEWS.find(v => v.name === viewName);
        view.activate();
        this.activeView = view;
        return this;
    }


    enableToViewButtons() {
        Array.from(document.querySelectorAll('[data-to-view]')).forEach(e => {
            const viewName = e.getAttribute('data-to-view');
            e.addEventListener('click', () => this.setView(viewName));
        });
    }
}

const nope = () => { };

class View {
    constructor(name, activateFn, deactivateFn) {
        this.listeners = { activate: [], deactivate: [] };
        this.name = name;
        this.activateFn = activateFn || nope;
        this.deactivateFn = deactivateFn || nope;
        VIEWS.push(this);
    }

    activate() {
        document.querySelector(`.view_${this.name}`).classList.add('view_active');
        this.activateFn();
        this.listeners.activate.forEach(fn => fn(this));
    }

    deactivate() {
        document.querySelector(`.view_${this.name}`).classList.remove('view_active');
        this.deactivateFn();
        this.listeners.deactivate.forEach(fn => fn(this));
    }

    on(event, listener) {
        if (!this.listeners[event]) {
            throw new Error(`Event "${event}" not supported by View`);
        }
        this.listeners[event].push(listener);
    }

}