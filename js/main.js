// Interactive elements for Malaysian Medical Ethics Curriculum
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Section navigation for case studies and interactive content
    function navigateToSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update progress bar
            updateProgressBar(sectionId);
            
            // Update navigation buttons
            updateNavigationButtons(sectionId);
            
            // Update current section display
            const currentSectionDisplay = document.getElementById('current-section');
            if (currentSectionDisplay) {
                currentSectionDisplay.textContent = targetSection.querySelector('h2').textContent;
            }
            
            // Scroll to top of section
            window.scrollTo(0, 0);
        }
    }
    
    // Make navigateToSection available globally
    window.navigateToSection = navigateToSection;
    
    // Update progress bar based on current section
    function updateProgressBar(currentSectionId) {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const sections = document.querySelectorAll('section');
        const sectionArray = Array.from(sections);
        const currentIndex = sectionArray.findIndex(section => section.id === currentSectionId);
        
        if (currentIndex >= 0) {
            const progress = ((currentIndex + 1) / sections.length) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    // Update navigation buttons based on current section
    function updateNavigationButtons(currentSectionId) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (!prevBtn || !nextBtn) return;
        
        const sections = document.querySelectorAll('section');
        const sectionArray = Array.from(sections);
        const currentIndex = sectionArray.findIndex(section => section.id === currentSectionId);
        
        // Update previous button
        prevBtn.disabled = currentIndex <= 0;
        
        // Update next button
        nextBtn.disabled = currentIndex >= sectionArray.length - 1;
        
        // Set up click handlers
        prevBtn.onclick = function() {
            if (currentIndex > 0) {
                navigateToSection(sectionArray[currentIndex - 1].id);
            }
        };
        
        nextBtn.onclick = function() {
            if (currentIndex < sectionArray.length - 1) {
                navigateToSection(sectionArray[currentIndex + 1].id);
            }
        };
    }
    
    // Initialize accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
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
                
                // Show continue button
                const quizNextBtn = document.getElementById('quiz-next-btn');
                if (quizNextBtn) {
                    quizNextBtn.style.display = 'block';
                }
            });
        }
    }
    
    // Decision point functionality
    window.checkDecision = function(sceneId) {
        const selectedOption = document.querySelector(`input[name="${sceneId}-decision"]:checked`);
        const feedbackDiv = document.getElementById(`${sceneId}-feedback`);
        const feedbackContent = document.getElementById(`${sceneId}-feedback-content`);
        const nextButton = document.getElementById(`${sceneId}-next-btn`);
        
        if (selectedOption && feedbackDiv && feedbackContent) {
            feedbackDiv.style.display = 'block';
            
            if (selectedOption.dataset.correct === 'true') {
                feedbackDiv.className = 'feedback correct';
                // Feedback content is set in the specific case study HTML
            } else {
                feedbackDiv.className = 'feedback incorrect';
                // Feedback content is set in the specific case study HTML
            }
            
            // Enable next button after decision is made
            if (nextButton) {
                nextButton.disabled = false;
            }
        }
    };
    
    // Initialize interactive elements
    initializeQuiz();
    
    // Lecture navigation
    const lectureLinks = document.querySelectorAll('.lecture-card');
    lectureLinks.forEach(link => {
        link.addEventListener('click', function() {
            const lectureUrl = this.dataset.url;
            if (lectureUrl) {
                window.location.href = lectureUrl;
            }
        });
    });
    
    // Case study navigation
    const caseStudyLinks = document.querySelectorAll('.case-study-card');
    caseStudyLinks.forEach(link => {
        link.addEventListener('click', function() {
            const caseUrl = this.dataset.url;
            if (caseUrl) {
                window.location.href = caseUrl;
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            // Sample search data - in a real implementation, this would be generated from all content
            const searchData = [
                { title: 'Lecture 1: Introduction to Medical Ethics', url: 'lectures/lecture1.html', type: 'lecture' },
                { title: 'Lecture 2: Ethical Principles in Healthcare', url: 'lectures/lecture2.html', type: 'lecture' },
                { title: 'Lecture 9: Physician Relationships with Colleagues', url: 'lectures/lecture9.html', type: 'lecture' },
                { title: 'Lecture 10: Ethics in Medical Research', url: 'lectures/lecture10.html', type: 'lecture' },
                { title: 'Case Study 1: Informed Consent', url: 'case-studies/case1.html', type: 'case-study' },
                { title: 'Case Study 9: Interprofessional Conflict', url: 'case-studies/case9.html', type: 'case-study' },
                { title: 'Case Study 10: Research Ethics Application', url: 'case-studies/case10.html', type: 'case-study' }
            ];
            
            const filteredResults = searchData.filter(item => 
                item.title.toLowerCase().includes(query)
            );
            
            if (filteredResults.length > 0) {
                let resultsHTML = '<ul>';
                filteredResults.forEach(result => {
                    const icon = result.type === 'lecture' ? 
                        '<i class="fas fa-book-open"></i>' : 
                        '<i class="fas fa-clipboard-list"></i>';
                    
                    resultsHTML += `
                        <li>
                            <a href="${result.url}">
                                ${icon} ${result.title}
                            </a>
                        </li>
                    `;
                });
                resultsHTML += '</ul>';
                
                searchResults.innerHTML = resultsHTML;
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<p>No results found</p>';
                searchResults.style.display = 'block';
            }
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Progress tracking
    function initializeProgressTracking() {
        // Check if user has visited pages before
        const visitedLectures = JSON.parse(localStorage.getItem('visitedLectures')) || [];
        const visitedCases = JSON.parse(localStorage.getItem('visitedCases')) || [];
        
        // Mark current page as visited
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/lectures/')) {
            const lectureName = currentPath.split('/').pop();
            if (!visitedLectures.includes(lectureName)) {
                visitedLectures.push(lectureName);
                localStorage.setItem('visitedLectures', JSON.stringify(visitedLectures));
            }
        } else if (currentPath.includes('/case-studies/')) {
            const caseName = currentPath.split('/').pop();
            if (!visitedCases.includes(caseName)) {
                visitedCases.push(caseName);
                localStorage.setItem('visitedCases', JSON.stringify(visitedCases));
            }
        }
        
        // Update progress indicators on lectures and case studies pages
        const lectureItems = document.querySelectorAll('.lecture-card');
        lectureItems.forEach(item => {
            const lectureUrl = item.dataset.url;
            if (lectureUrl) {
                const lectureName = lectureUrl.split('/').pop();
                if (visitedLectures.includes(lectureName)) {
                    item.classList.add('visited');
                    const progressIndicator = item.querySelector('.progress-indicator');
                    if (progressIndicator) {
                        progressIndicator.textCo<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>