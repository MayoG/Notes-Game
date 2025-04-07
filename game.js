class NoteGame {
    constructor() {
        this.notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.currentNote = '';
        this.correctStreak = 0;  
        this.bestScore = this.loadBestScore();
        this.setupEventListeners();
        this.newNote();
        this.updateStreakDisplay();
    }

    loadBestScore() {
        const savedScore = localStorage.getItem('bestScore');
        return savedScore ? parseInt(savedScore) : 0;
    }

    saveBestScore() {
        localStorage.setItem('bestScore', this.bestScore);
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
        // Clear previous staff
        const trebleStaffContainer = document.getElementById('treble-staff');
        const bassStaffContainer = document.getElementById('bass-staff');
        trebleStaffContainer.innerHTML = '';
        bassStaffContainer.innerHTML = '';

        // Set up renderer for both staves
        const trebleRenderer = new VF.Renderer(trebleStaffContainer, VF.Renderer.Backends.SVG);
        const bassRenderer = new VF.Renderer(bassStaffContainer, VF.Renderer.Backends.SVG);
        
        // Resize both renderers
        trebleRenderer.resize(500, 200);
        bassRenderer.resize(500, 200);
        
        const trebleContext = trebleRenderer.getContext();
        const bassContext = bassRenderer.getContext();
        
        // Create treble staff with treble clef
        const trebleStave = new VF.Stave(10, 40, 400);
        trebleStave.addClef('treble');
        trebleStave.setContext(trebleContext).draw();

        // Create bass staff with bass clef
        const bassStave = new VF.Stave(10, 40, 400);
        bassStave.addClef('bass');
        bassStave.setContext(bassContext).draw();

        // Randomly choose which staff to show the note
        const showOnTreble = Math.random() < 0.5;
        const octave = showOnTreble ? [4, 5][Math.floor(Math.random() * 2)] : [2, 3][Math.floor(Math.random() * 2)];
        
        // Create the note
        const note = new VF.StaveNote({
            clef: showOnTreble ? 'treble' : 'bass',
            keys: [`${this.currentNote}/${octave}`],
            duration: 'q'
        });
        
        // Create voice
        const voice = new VF.Voice({
            num_beats: 1,
            beat_value: 4,
            resolution: VF.RESOLUTION
        });
        
        voice.setStrict(false);
    
        voice.addTickable(note);
        
        // Format and draw the note
        const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
        formatter.formatToStave([voice], showOnTreble ? trebleStave : bassStave);
        voice.draw(showOnTreble ? trebleContext : bassContext, showOnTreble ? trebleStave : bassStave);
    }

    checkAnswer(userNote) {
        const messageDiv = document.getElementById('message');
        
        if (userNote === this.currentNote) {
            this.correctStreak++;
            if (this.correctStreak > this.bestScore) {
                this.bestScore = this.correctStreak;
                this.saveBestScore();
            }
            messageDiv.textContent = 'Correct!';
            messageDiv.classList.add('visible');
            messageDiv.classList.remove('hidden');
            setTimeout(() => {
                messageDiv.classList.remove('visible');
                this.newNote();
            }, 500);
        } else {
            this.correctStreak = 0;
            messageDiv.textContent = 'Try again!';
            messageDiv.classList.add('visible');
            messageDiv.classList.remove('hidden');
            setTimeout(() => {
                messageDiv.classList.remove('visible');
            }, 1000);
        }
        this.updateStreakDisplay();
    }

    updateStreakDisplay() {
        const streakElement = document.getElementById('streak');
        const bestScoreElement = document.getElementById('best-score');
        
        if (streakElement) {
            streakElement.textContent = `Streak: ${this.correctStreak}`;
        }
        
        if (bestScoreElement) {
            bestScoreElement.textContent = `Best: ${this.bestScore}`;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NoteGame();
});