// Interactive elements for Malaysian Medical Ethics Case Studies

document.addEventListener('DOMContentLoaded', function() {
    // Initialize comic-style scenario navigation
    initializeComicNavigation();
    
    // Initialize decision points
    initializeDecisionPoints();
    
    // Initialize quiz functionality
    initializeQuiz();
});

// Comic-style scenario navigation
function initializeComicNavigation() {
    const comicPanels = document.querySelectorAll('.comic-panel');
    const nextPanelButtons = document.querySelectorAll('.next-panel-btn');
    const prevPanelButtons = document.querySelectorAll('.prev-panel-btn');
    
    // Hide all panels except the first one
    if (comicPanels.length > 0) {
        comicPanels.forEach((panel, index) => {
            if (index === 0) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
    
    // Next panel button functionality
    nextPanelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentPanel = this.closest('.comic-panel');
            const nextPanel = currentPanel.nextElementSibling;
            
            if (nextPanel && nextPanel.classList.contains('comic-panel')) {
                currentPanel.classList.remove('active');
                nextPanel.classList.add('active');
                
                // Update progress
                updateComicProgress();
                
                // Scroll to top of panel
                nextPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Previous panel button functionality
    prevPanelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentPanel = this.closest('.comic-panel');
            const prevPanel = currentPanel.previousElementSibling;
            
            if (prevPanel && prevPanel.classList.contains('comic-panel')) {
                currentPanel.classList.remove('active');
                prevPanel.classList.add('active');
                
                // Update progress
                updateComicProgress();
                
                // Scroll to top of panel
                prevPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Update comic progress indicator
    updateComicProgress();
}

// Update comic progress bar
function updateComicProgress() {
    const comicPanels = document.querySelectorAll('.comic-panel');
    const activePanel = document.querySelector('.comic-panel.active');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (comicPanels.length > 0 && activePanel && progressFill && progressPercentage) {
        const currentIndex = Array.from(comicPanels).indexOf(activePanel);
        const progress = ((currentIndex + 1) / comicPanels.length) * 100;
        
        progressFill.style.width = progress + '%';
        progressPercentage.textContent = Math.round(progress) + '%';
    }
}

// Decision points functionality
function initializeDecisionPoints() {
    const decisionPoints = document.querySelectorAll('.decision-point');
    
    decisionPoints.forEach(decisionPoint => {
        const decisionForm = decisionPoint.querySelector('form');
        const submitButton = decisionPoint.querySelector('.submit-decision');
        const feedbackDiv = decisionPoint.querySelector('.feedback');
        const nextButton = decisionPoint.querySelector('.next-decision-btn');
        
        if (submitButton && decisionForm) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const selectedOption = decisionForm.querySelector('input[type="radio"]:checked');
                
                if (selectedOption) {
                    // Show feedback
                    if (feedbackDiv) {
                        feedbackDiv.style.display = 'block';
                        
                        if (selectedOption.dataset.correct === 'true') {
                            feedbackDiv.className = 'feedback correct';
                        } else {
                            feedbackDiv.className = 'feedback incorrect';
                        }
                    }
                    
                    // Enable next button
                    if (nextButton) {
                        nextButton.disabled = false;
                    }
                } else {
                    alert('Please select an option before submitting.');
                }
            });
        }
        
        // Next button functionality
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                const currentDecisionPoint = this.closest('.decision-point');
                const nextDecisionPoint = currentDecisionPoint.nextElementSibling;
                
                if (nextDecisionPoint) {
                    currentDecisionPoint.style.display = 'none';
                    nextDecisionPoint.style.display = 'block';
                    
                    // Scroll to top of next decision point
                    nextDecisionPoint.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // If no next decision point, move to quiz section
                    const quizSection = document.getElementById('quiz-section');
                    if (quizSection) {
                        currentDecisionPoint.style.display = 'none';
                        quizSection.style.display = 'block';
                        
                        // Scroll to top of quiz section
                        quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        }
    });
}

// Quiz functionality
function initializeQuiz() {
    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return;
    
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressFill = document.getElementById('quiz-progress-fill');
    
    let currentQuestionIndex = 1;
    const questions = document.querySelectorAll('.question');
    const totalQuestions = questions.length;
    
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = totalQuestions;
    }
    
    // Update quiz progress
    function updateQuizProgress() {
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = currentQuestionIndex;
        }
        
        if (progressFill) {
            const progress = (currentQuestionIndex / totalQuestions) * 100;
            progressFill.style.width = progress + '%';
        }
        
        // Update button states
        if (prevQuestionBtn) {
            prevQuestionBtn.disabled = currentQuestionIndex === 1;
        }
        
        if (nextQuestionBtn && submitQuizBtn) {
            if (currentQuestionIndex === totalQuestions) {
                nextQuestionBtn.style.display = 'none';
                submitQuizBtn.style.display = 'inline-block';
            } else {
                nextQuestionBtn.style.display = 'inline-block';
                submitQuizBtn.style.display = 'none';
            }
        }
    }
    
    // Show question by index
    function showQuestion(index) {
        // Hide all questions
        questions.forEach(question => {
            question.style.display = 'none';
        });
        
        // Show current question
        const currentQuestion = document.getElementById('question' + index);
        if (currentQuestion) {
            currentQuestion.style.display = 'block';
        }
        
        currentQuestionIndex = index;
        updateQuizProgress();
    }
    
    // Initialize first question
    showQuestion(1);
    
    // Next question button
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', function() {
            if (currentQuestionIndex < totalQuestions) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
    }
    
    // Previous question button
    if (prevQuestionBtn) {
        prevQuestionBtn.addEventListener('click', function() {
            if (currentQuestionIndex > 1) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }
    
    // Submit quiz
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let score = 0;
            let mcqQuestions = 0;
            
            // Count MCQ questions and check answers
            questions.forEach(question => {
                if (question.classList.contains('mcq-question')) {
                    mcqQuestions++;
                    const questionNumber = question.id.replace('question', '');
                    const selectedOption = document.querySelector(`input[name="q${questionNumber}"]:checked`);
                    
                    if (selectedOption && selectedOption.dataset.correct === 'true') {
                        score++;
                    }
                }
            });
            
            // Display score
            const scoreDisplay = document.getElementById('quiz-score');
            if (scoreDisplay) {
                scoreDisplay.innerHTML = `
                    <div class="score-container">
                        <h3>Quiz Results</h3>
                        <p>You scored ${score} out of ${mcqQuestions} on the multiple choice questions.</p>
                        <div class="score-feedback">
                            ${score >= mcqQuestions * 0.8 ? 
                                '<p class="excellent-score">Excellent! You have a strong understanding of the ethical principles.</p>' : 
                                score >= mcqQuestions * 0.6 ? 
                                    '<p class="good-score">Good job! You understand most of the key concepts.</p>' : 
                                    '<p class="review-needed">You may want to review the lecture materials to strengthen your understanding.</p>'
                            }
                        </div>
                    </div>
                `;
                scoreDisplay.style.display = 'block';
            }
            
            // Show discussion section
            const discussionSection = document.getElementById('discussion-section');
            if (discussionSection) {
                discussionSection.style.display = 'block';
                
                // Scroll to discussion section
                discussionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}
