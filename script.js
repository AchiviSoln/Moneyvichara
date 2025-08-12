        // Game state
        let gameState = {
            currentQuestion: 1,
            score: 0,
            timeLeft: 45,
            gameStarted: false,
            gameEnded: false,
            selectedAnswer: null,
            timer: null,
            lifelines: {
                changeQuestion: true,
                fiftyFifty: true
            },
            currentRound: 1
        };

        // Scoring system
        const scoringSystem = {
            1: { points: 5, safe: 15 },   // Round 1: 3 questions × 5 points each = 15 total
            2: { points: 10, safe: 55 },  // Round 2: 4 questions × 10 points each = 40 total (15+40=55)
            3: { points: 15, safe: 100 }  // Round 3: 3 questions × 15 points each = 45 total (55+45=100)
        };

        // Elite business questions with real-world focus
        const questions = [
            // Round 1: Foundation (Questions 1-3) - 45 seconds each, 5 points
            {
                question: "Which Indian company became the first to cross ₹1 trillion market cap in 2019?",
                options: ["Tata Consultancy Services", "Reliance Industries", "HDFC Bank", "Infosys"],
                correct: 0,
                round: 1,
                timeLimit: 45
            },
            {
                question: "What is the primary business model of Zomato and Swiggy?",
                options: ["B2B marketplace", "Platform-as-a-Service", "Two-sided marketplace", "Direct-to-Consumer"],
                correct: 2,
                round: 1,
                timeLimit: 45
            },
            {
                question: "Which financial metric is most commonly used to value startups in early stages?",
                options: ["P/E Ratio", "Revenue Multiple", "EBITDA Multiple", "Price-to-Sales Ratio"],
                correct: 1,
                round: 1,
                timeLimit: 45
            },
            // Round 2: Intermediate (Questions 4-7) - 60 seconds each, 10 points
            {
                question: "Tesla's business strategy primarily focuses on which competitive advantage?",
                options: ["Cost Leadership", "Vertical Integration", "Network Effects", "Brand Premium"],
                correct: 1,
                round: 2,
                timeLimit: 60
            },
            {
                question: "What was the key reason behind WeWork's failed IPO in 2019?",
                options: ["Market competition", "Corporate governance issues", "Technology problems", "Legal disputes"],
                correct: 1,
                round: 2,
                timeLimit: 60
            },
            {
                question: "Which strategy did Netflix use to disrupt the traditional TV industry?",
                options: ["Price penetration", "Content aggregation", "Original content creation", "Technology innovation"],
                correct: 2,
                round: 2,
                timeLimit: 60
            },
            {
                question: "What is the primary business model that made Uber successful globally?",
                options: ["Asset-light platform", "Direct employment", "Franchise model", "Subscription service"],
                correct: 0,
                round: 2,
                timeLimit: 60
            },
            // Round 3: Advanced (Questions 8-10) - 75 seconds each, 15 points
            {
                question: "What is the primary challenge with India's Digital Rupee (CBDC) adoption?",
                options: ["Technical infrastructure", "User privacy concerns", "Banking system integration", "Regulatory compliance"],
                correct: 1,
                round: 3,
                timeLimit: 75
            },
            {
                question: "Which factor most significantly impacts India's Ease of Doing Business ranking?",
                options: ["Tax compliance", "Contract enforcement", "Starting a business", "Getting electricity"],
                correct: 1,
                round: 3,
                timeLimit: 75
            },
            {
                question: "What is the main risk in ESG investing for emerging markets like India?",
                options: ["Data availability", "Regulatory changes", "Currency fluctuation", "Political instability"],
                correct: 0,
                round: 3,
                timeLimit: 75
            }
        ];

        // Alternative questions for change question lifeline - matched by round
        const alternativeQuestions = {
            1: [
                {
                    question: "What does SEBI stand for in Indian financial markets?",
                    options: ["Securities Exchange Board of India", "Stock Exchange Bureau of India", "Securities and Exchange Board of India", "Stock and Exchange Bureau of India"],
                    correct: 2,
                    round: 1,
                    timeLimit: 45
                },
                {
                    question: "Which Indian unicorn was the first to go public via SPAC?",
                    options: ["Paytm", "PolicyBazaar", "Nykaa", "Droom"],
                    correct: 3,
                    round: 1,
                    timeLimit: 45
                },
                {
                    question: "What is the main revenue source for Google's parent company Alphabet?",
                    options: ["Cloud services", "Hardware sales", "Advertising", "Software licensing"],
                    correct: 2,
                    round: 1,
                    timeLimit: 45
                }
            ],
            2: [
                {
                    question: "Which strategy did Amazon use to enter the Indian e-commerce market?",
                    options: ["Acquisition", "Joint venture", "Greenfield investment", "Licensing"],
                    correct: 2,
                    round: 2,
                    timeLimit: 60
                },
                {
                    question: "What is the primary reason for Flipkart's success in India over Amazon initially?",
                    options: ["Better pricing", "Local market understanding", "Superior technology", "Government support"],
                    correct: 1,
                    round: 2,
                    timeLimit: 60
                },
                {
                    question: "Which financial instrument did RBI introduce to improve monetary policy transmission?",
                    options: ["Repo rate", "Reverse repo rate", "Marginal Standing Facility", "Liquidity Adjustment Facility"],
                    correct: 3,
                    round: 2,
                    timeLimit: 60
                }
            ],
            3: [
                {
                    question: "What is the biggest challenge for Indian companies in global supply chain management post-COVID?",
                    options: ["Cost optimization", "Supply chain resilience", "Digital transformation", "Regulatory compliance"],
                    correct: 1,
                    round: 3,
                    timeLimit: 75
                },
                {
                    question: "Which factor most influences India's corporate bond market development?",
                    options: ["Credit rating agencies", "Institutional investors", "Regulatory framework", "Market liquidity"],
                    correct: 2,
                    round: 3,
                    timeLimit: 75
                },
                {
                    question: "What is the key driver of India's fintech revolution?",
                    options: ["UPI infrastructure", "Mobile penetration", "Digital literacy", "Government initiatives"],
                    correct: 0,
                    round: 3,
                    timeLimit: 75
                }
            ]
        };

        function startGame() {
            document.getElementById('startScreen').classList.add('hidden');
            gameState.gameStarted = true;
            gameState.currentQuestion = 1;
            gameState.score = 0;
            gameState.currentRound = 1;
            gameState.timeLeft = questions[0].timeLimit;
            startTimer();
            displayQuestion();
            updateUI();
        }

        function getCurrentRound() {
            if (gameState.currentQuestion <= 3) return 1;
            if (gameState.currentQuestion <= 7) return 2;
            return 3;
        }

        function displayQuestion() {
            const currentQ = questions[gameState.currentQuestion - 1];
            const currentRound = getCurrentRound();
            gameState.currentRound = currentRound;
            
            document.getElementById('questionText').textContent = currentQ.question;
            
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            
            currentQ.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${option}`;
                optionDiv.onclick = () => selectAnswer(index);
                optionsGrid.appendChild(optionDiv);
            });

            // Update level indicator and round info
            const roundNames = ["Foundation", "Intermediate", "Expert"];
            const roundPoints = [5, 10, 15];
            document.getElementById('levelIndicator').textContent = `Round ${currentRound}: ${roundNames[currentRound - 1]} (${roundPoints[currentRound - 1]} points each)`;
            
            // Update round info
            let roundInfoText = `Round ${currentRound}: ${roundNames[currentRound - 1]}<br>${roundPoints[currentRound - 1]} points per question<br>`;
            if (currentRound === 3) {
                roundInfoText += "⚠️ NO LIFELINES<br>⚠️ NO QUIT OPTION";
            } else {
                roundInfoText += "Lifelines Available";
            }
            document.getElementById('roundInfo').innerHTML = roundInfoText;
            
            // Update lifelines and quit button availability
            updateLifelineAvailability();
            
            gameState.selectedAnswer = null;
            document.getElementById('confirmBtn').disabled = true;
            gameState.timeLeft = currentQ.timeLimit;
            updateTimer();
        }

        function updateLifelineAvailability() {
            const isRound3 = gameState.currentRound === 3;
            const changeQuestionBtn = document.getElementById('changeQuestion');
            const fiftyFiftyBtn = document.getElementById('fiftyFifty');
            const quitBtn = document.getElementById('quitBtn');
            
            if (isRound3) {
                // Disable lifelines and quit in round 3
                if (!changeQuestionBtn.classList.contains('used')) {
                    changeQuestionBtn.classList.add('disabled');
                }
                if (!fiftyFiftyBtn.classList.contains('used')) {
                    fiftyFiftyBtn.classList.add('disabled');
                }
                quitBtn.disabled = true;
                quitBtn.textContent = "NO QUIT (Round 3)";
            } else {
                // Enable lifelines and quit in rounds 1-2
                changeQuestionBtn.classList.remove('disabled');
                fiftyFiftyBtn.classList.remove('disabled');
                quitBtn.disabled = false;
                quitBtn.textContent = "QUIT GAME";
            }
        }

        function selectAnswer(index) {
            // Clear previous selections
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select new answer
            document.querySelectorAll('.option')[index].classList.add('selected');
            gameState.selectedAnswer = index;
            document.getElementById('confirmBtn').disabled = false;
        }

        function confirmAnswer() {
            if (gameState.selectedAnswer === null) return;
            
            clearInterval(gameState.timer);
            const currentQ = questions[gameState.currentQuestion - 1];
            const isCorrect = gameState.selectedAnswer === currentQ.correct;
            
            // Show correct/incorrect
            document.querySelectorAll('.option').forEach((opt, index) => {
                if (index === currentQ.correct) {
                    opt.classList.add('correct');
                } else if (index === gameState.selectedAnswer && !isCorrect) {
                    opt.classList.add('incorrect');
                }
            });

            if (isCorrect) {
                // Update score based on round
                const currentRound = getCurrentRound();
                gameState.score += scoringSystem[currentRound].points;
                updateScoreLadder();
                
                setTimeout(() => {
                    if (gameState.currentQuestion === 10) {
                        endGame("🏆 CHAMPION! You've conquered all 10 questions and earned the maximum prize!");
                    } else {
                        nextQuestion();
                    }
                }, 2000);
            } else {
                setTimeout(() => {
                    const safeScore = getSafeScore();
                    endGame(`❌ Wrong answer! You take home ${safeScore} points.`);
                }, 2000);
            }
        }

        function nextQuestion() {
            gameState.currentQuestion++;
            displayQuestion();
            updateUI();
            startTimer();
        }

        function getSafeScore() {
            if (gameState.currentQuestion >= 8) return 55; // Round 2 safe score (after Q7)
            if (gameState.currentQuestion >= 4) return 15; // Round 1 safe score (after Q3)
            return 0;
        }

        function quitGame() {
            if (gameState.currentRound === 3) {
                alert("You cannot quit during Round 3! You must complete all remaining questions.");
                return;
            }
            
            if (confirm(`Are you sure you want to quit? You'll take home ${gameState.score} points.`)) {
                clearInterval(gameState.timer);
                endGame(`🚪 You quit the game and took home ${gameState.score} points!`);
            }
        }

        function endGame(message) {
            gameState.gameEnded = true;
            clearInterval(gameState.timer);
            
            document.getElementById('finalScore').textContent = `Final Score: ${gameState.score} Points`;
            document.getElementById('gameResult').innerHTML = `<p style="font-size: 18px; text-align: center;">${message}</p>`;
            
            let performance = "";
            if (gameState.score >= 90) performance = "🏆 BUSINESS LEGEND! Outstanding performance!";
            else if (gameState.score >= 70) performance = "🥈 BUSINESS EXPERT! Excellent knowledge!";
            else if (gameState.score >= 50) performance = "🥉 BUSINESS PROFESSIONAL! Good performance!";
            else if (gameState.score >= 30) performance = "📈 ASPIRING MANAGER! Keep learning!";
            else performance = "📚 BUSINESS STUDENT! Practice makes perfect!";
            
            document.getElementById('gameResult').innerHTML += `<p style="margin-top: 15px; font-weight: bold; color: #ff6b35;">${performance}</p>`;
            document.getElementById('endScreen').classList.remove('hidden');
        }

        function startTimer() {
            clearInterval(gameState.timer);
            gameState.timer = setInterval(() => {
                gameState.timeLeft--;
                updateTimer();
                
                if (gameState.timeLeft <= 10) {
                    document.getElementById('timer').classList.add('warning');
                }
                
                if (gameState.timeLeft <= 0) {
                    clearInterval(gameState.timer);
                    const safeScore = getSafeScore();
                    endGame(`⏰ Time's up! You take home ${safeScore} points.`);
                }
            }, 1000);
        }

        function updateTimer() {
            const timerElement = document.getElementById('timer');
            timerElement.textContent = `Time: ${gameState.timeLeft}s`;
            
            if (gameState.timeLeft > 10) {
                timerElement.classList.remove('warning');
            }
        }

        function updateUI() {
            document.getElementById('currentScore').textContent = gameState.score;
            document.getElementById('questionNum').textContent = gameState.currentQuestion;
            updateScoreLadder();
        }

        function updateScoreLadder() {
            const scoreValues = [5, 10, 15, 25, 35, 45, 55, 70, 85, 100];
            document.querySelectorAll('.ladder-item').forEach((item, index) => {
                const questionNum = parseInt(item.dataset.question);
                item.classList.remove('current', 'completed');
                
                if (questionNum < gameState.currentQuestion) {
                    item.classList.add('completed');
                } else if (questionNum === gameState.currentQuestion) {
                    item.classList.add('current');
                }
            });
        }

        function useChangeQuestion() {
            if (!gameState.lifelines.changeQuestion || gameState.currentRound === 3) return;
            
            if (confirm("Are you sure you want to change this question? This lifeline can only be used once.")) {
                gameState.lifelines.changeQuestion = false;
                document.getElementById('changeQuestion').classList.add('used');
                document.getElementById('changeQuestion').innerHTML = '🔄 Used';
                
                // Replace current question with alternative from same round
                const currentRound = getCurrentRound();
                const availableAlternatives = alternativeQuestions[currentRound];
                const randomIndex = Math.floor(Math.random() * availableAlternatives.length);
                const alternativeQ = availableAlternatives[randomIndex];
                
                if (alternativeQ) {
                    questions[gameState.currentQuestion - 1] = alternativeQ;
                    displayQuestion();
                    clearInterval(gameState.timer);
                    startTimer();
                }
            }
        }

        function useFiftyFifty() {
            if (!gameState.lifelines.fiftyFifty || gameState.currentRound === 3) return;
            
            if (confirm("Are you sure you want to use 50:50? This lifeline can only be used once.")) {
                gameState.lifelines.fiftyFifty = false;
                document.getElementById('fiftyFifty').classList.add('used');
                document.getElementById('fiftyFifty').innerHTML = '💡 Used';
                
                const currentQ = questions[gameState.currentQuestion - 1];
                const options = document.querySelectorAll('.option');
                const incorrectOptions = [];
                
                // Find incorrect options
                options.forEach((option, index) => {
                    if (index !== currentQ.correct) {
                        incorrectOptions.push(index);
                    }
                });
                
                // Hide 2 incorrect options randomly
                const shuffled = incorrectOptions.sort(() => Math.random() - 0.5);
                const toHide = shuffled.slice(0, 2);
                toHide.forEach(index => {
                    options[index].classList.add('disabled');
                });
            }
        }

        function restartGame() {
            // Reset game state
            gameState = {
                currentQuestion: 1,
                score: 0,
                timeLeft: 45,
                gameStarted: false,
                gameEnded: false,
                selectedAnswer: null,
                timer: null,
                lifelines: {
                    changeQuestion: true,
                    fiftyFifty: true
                },
                currentRound: 1
            };
            
            // Reset UI
            document.getElementById('endScreen').classList.add('hidden');
            document.getElementById('startScreen').classList.remove('hidden');
            document.getElementById('changeQuestion').classList.remove('used', 'disabled');
            document.getElementById('changeQuestion').innerHTML = '🔄 Change Question';
            document.getElementById('fiftyFifty').classList.remove('used', 'disabled');
            document.getElementById('fiftyFifty').innerHTML = '💡 50:50';
            document.getElementById('quitBtn').disabled = false;
            document.getElementById('quitBtn').textContent = 'QUIT GAME';
            
            // Clear any option styling
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
            });
        }

        // Initialize game
        document.addEventListener('DOMContentLoaded', function() {
            updateUI();
        });
