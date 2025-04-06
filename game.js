class NoteGame {
    constructor() {
        this.notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.currentNote = '';
        this.setupEventListeners();
        this.newNote();
    }

    setupEventListeners() {
        document.querySelectorAll('.note-button').forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button.dataset.note));
        });
    }

    newNote() {
        let newNote;
        do {
            newNote = this.notes[Math.floor(Math.random() * this.notes.length)];
        } while (newNote === this.currentNote);
        
        this.currentNote = newNote;
        this.renderNote();
    }

    renderNote() {
        const VF = VexFlow;
        
        // Clear previous rendering
        const staffContainer = document.getElementById('staff');
        staffContainer.innerHTML = '';
        
        const renderer = new VF.Renderer(staffContainer, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();
        
        // Create staff with treble clef
        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble');
        stave.setContext(context).draw();

        const octave = Math.random() < 0.5 ? 4 : 5;
    
        // Create a single quarter note
        const note = new VF.StaveNote({
            clef: 'treble',
            keys: [`${this.currentNote}/${octave}`],
            duration: 'q'
        });
    
        // Create voice for 1/4 time (1 beat total)
        const voice = new VF.Voice({
            num_beats: 1,
            beat_value: 4,
            resolution: VF.RESOLUTION
        });

        voice.setStrict(false);
    
        voice.addTickable(note);
    
        // Format and justify the note in the stave
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
    
        // Draw voice
        voice.draw(context, stave);
    }

    checkAnswer(selectedNote) {
        const messageDiv = document.getElementById('message');
        
        if (selectedNote === this.currentNote) {
            messageDiv.textContent = 'Correct!';
            messageDiv.classList.add('visible');
            messageDiv.classList.remove('hidden');
            
            // Show new note immediately
            this.newNote();
            setTimeout(() => {
                messageDiv.classList.add('hidden');
                messageDiv.classList.remove('visible');
            }, 500); // Shorter duration for the message
        } else {
            messageDiv.textContent = 'Try again!';
            messageDiv.classList.add('visible');
            messageDiv.classList.remove('hidden');
            
            setTimeout(() => {
                messageDiv.classList.add('hidden');
                messageDiv.classList.remove('visible');
            }, 1000);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NoteGame();
});