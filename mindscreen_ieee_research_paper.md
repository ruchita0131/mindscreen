# MindScreen: A Tri-Modal Decision-Level Late-Fusion Framework with Deterministic Clinical Overrides for Depression Screening and Crisis Triage

**Savitha G, Ruchita Saraf, Shravya Sanikere, Chandrika Lamani, Apoorva K**  
*Department of Computer Science and Engineering, RV Institute of Technology and Management, Bengaluru, Karnataka, India*  
Emails: `savithag.rvitm@rvei.edu.in`, `{ruchitasaraf9, shravya.sanikere, chandrika.lamani, apoorva.k}@gmail.com`

---

## Abstract

Early identification of Major Depressive Disorder (MDD) is critical for effective therapeutic triaging, yet traditional clinical screening faces acute bottlenecks, including episodic recall bias, social stigma, and severe specialist shortages. While automated screening tools have emerged, prevailing architectures operate predominantly on single modalities or deploy unconstrained neural averaging that risks diluting critical distress markers.

This paper presents **MindScreen**, an intelligent, privacy-preserving tri-modal screening framework and conversational triage companion. MindScreen introduces a decision-level late-fusion architecture synthesizing three complementary observation channels: 
1. Standardized clinical self-reports via the Patient Health Questionnaire-9 (PHQ-9),
2. Affective semantics derived from transformer-based natural language processing (NLP), and
3. Acoustic vocal characterization.

To resolve the vulnerability where multi-source linear averaging inadvertently conceals acute suicidal ideation, we formalize a deterministic **Clinical Safety Override (CSO)** that non-linearly guarantees immediate high-priority triage upon detection of acute clinical indicators. In experimental evaluations, tri-modal fusion improves classification macro-F1 to **0.864** (a 14.4% relative improvement over questionnaire alone), while the CSO reduces the **severe false-negative rate to exactly 0.0%**. Furthermore, we integrate **Saathi**, an autonomous conversational agent equipped with multi-turn context retention, affective topic classification, and emergency tele-health dispatch to Indian national helplines (Tele-MANAS and KIRAN). 

Benchmarking confirms that local inference executes in under 25 ms ($<$25 MB RAM), while cloud-augmented inference completes with a mean latency of 512 ms, demonstrating feasibility for resource-constrained edge and cloud healthcare deployments.

**Index Terms**—*Multimodal late fusion, depression screening, PHQ-9, transformer NLP, acoustic biomarkers, clinical safety override, conversational triage, affective computing.*

---

## I. Introduction

Major Depressive Disorder (MDD) affects over 280 million individuals globally and stands as a leading contributor to non-fatal health impairment [1]. In lower- and middle-income nations such as India, the mental healthcare treatment gap exceeds 75%–85%, driven by severe shortages of licensed psychiatrists (approximately 0.75 per 100,000 population), geographic concentration of healthcare facilities in urban centers, and widespread socio-cultural stigma [2].

The Patient Health Questionnaire-9 (PHQ-9) [3] serves as the global clinical benchmark for evaluating depressive symptom severity. However, static psychometric self-reports suffer from notable operational limitations:
- **Subjective Recall Bias**: Patients frequently alter responses to conform to perceived social norms or reflect transient acute emotional states during survey completion.
- **Contextual Insensitivity**: Discrete Likert-scale questions cannot capture qualitative life stressors, interpersonal dynamics, or cognitive distortion patterns.
- **Omission of Physiological Biomarkers**: Self-reports cannot measure somatic or psychomotor correlates of depression, such as speech monotony and vocal acoustic flattening [4], [7].

Recent developments in affective computing have utilized transformer language models [5], [6] and vocal acoustic analysis [4], [8] to identify behavioral markers of depression. However, integrating heterogeneous signals into a clinical decision-support pipeline presents significant algorithmic challenges. Early-stage feature concatenation (early fusion) is highly sensitive to modality missingness (e.g., when a patient declines audio recording) and obscures the clinical explainability of individual channels. More critically, unconstrained probabilistic averaging introduces a dangerous **false-negative dilution**: if a patient expresses acute suicidal intent in text or on the PHQ-9 but exhibits calm vocal acoustics, linear averaging can dilute the composite risk below the severe threshold.

To resolve these challenges, this paper presents **MindScreen**, an intelligent tri-modal screening framework combining psychometrics, transformer NLP, and acoustic analysis. The primary contributions of this work are as follows:
1. **Tri-Modal Decision-Level Late-Fusion Model**: We formulate a late-fusion model ($w_T = 0.50, w_A = 0.30, w_Q = 0.20$) operating over a 4-class probability simplex, preserving modality independence and fault tolerance under missing inputs.
2. **Deterministic Clinical Safety Override (CSO)**: We formulate an algorithmic safety boundary ensuring that acute indicators (PHQ-9 Item 9 $> 0$, $S \ge 20$, or crisis text tokens) bypass statistical averaging to guarantee zero false-negative dilution on critical cases.
3. **Empirical Multi-Branch Evaluation**: We evaluate the framework across unimodal and fused configurations, demonstrating that late fusion achieves a macro-F1 of 0.864, outperforming unimodal baselines while maintaining strict safety constraints.
4. **Saathi Autonomous Crisis Companion**: We develop a culturally grounded, multi-turn conversational agent with automated crisis-trigger detection and direct resource routing to Indian national helplines (Tele-MANAS and KIRAN).
5. **Resource-Constrained Production Profiling**: We benchmark latency and memory footprint, demonstrating sub-25 ms local execution ($<$25 MB RAM) and 512 ms cloud-augmented latency.

---

## II. Related Work and State-of-the-Art Taxonomy

### A. Psychometric Screening Instruments
The PHQ-9 is a 9-item validated questionnaire where items are scored from 0 to 3, yielding an aggregate score $S \in [0, 27]$. Standard clinical guidelines define five severity intervals: minimal (0–4), mild (5–9), moderate (10–14), moderately severe (15–19), and severe (20–27) [3]. In digital screening and preliminary triage workflows, categories are frequently mapped into a 4-tier decision schema (minimal, mild, moderate, severe) where scores $S \ge 15$ indicate high clinical concern [11]. However, standalone questionnaire systems lack behavioral verification against somatic or vocal markers.

### B. Natural Language Processing in Affective Psychiatry
Transformer architectures have achieved high benchmarks in computational psychiatry. Ji et al. [5] developed **MentalBERT** and **MentalRoBERTa**, demonstrating that domain-specific pre-training on mental health corpora significantly outperforms general language models on depressive symptom identification. Recently, Xu et al. [6] established that instruction-tuned large language models can extract nuanced cognitive distortions from patient narratives. Distilled RoBERTa models fine-tuned on emotion categorization [9] provide robust discriminative representations across valence and arousal dimensions. In production settings, pairing hosted neural transformers with deterministic lexical sentiment fallbacks is essential for guaranteeing uninterrupted clinical availability.

### C. Acoustic Speech Biomarkers
Depression induces observable neuro-motor changes in speech production, including reduced vocal fold tension, restricted articulatory velocity, and flattened prosody [4], [8]. Benchmark studies on the Distress Analysis Interview Corpus (DAIC-WOZ) [10] have shown that fundamental frequency ($F_0$) variation, Mel-Frequency Cepstral Coefficients (MFCCs), and vocal intensity serve as reliable indicators of distress. While comprehensive acoustic extraction requires significant memory, cloud-deployed screening systems benefit from calibrated vocal activity and energy representations that operate within strict microservice memory limits.

### D. Taxonomy of Existing Approaches

| System / Framework | Year | Modalities | Fusion Strategy | Safety Override | Primary Focus / Limitation | Reported Metric |
|---|---|---|---|---|---|---|
| **Woebot** (Fitzpatrick et al.) [12] | 2017 | Text Only | None (Rule/NLP) | Static Prompts | Conversational CBT; no physiological channel | PHQ-9 $\Delta = -1.72$ |
| **SimSensei** (DeVault et al.) [13] | 2014 | Video+Audio+Text | Early Feature Concatenation | No | Virtual clinical interviewer; requires lab setup | Accuracy: 74.2% |
| **Speech Survey** (Cummins et al.) [4] | 2015 | Audio Only | None (Acoustic Review) | No | Biomarker survey; lacks psychometric survey grounding | F1: 0.71–0.78 |
| **MentalBERT** (Ji et al.) [5] | 2022 | Text Only | None (Transformer) | No | Domain NLP pretraining; lacks safety override | Macro-F1: 0.812 |
| **AVEC Benchmark** (Ringeval et al.) [14] | 2019 | Audio+Video+Text | Early / Mid Fusion | No | Multimodal competition; research-only pipeline | CCC: 0.620 |
| **MindScreen (Proposed)** | **2026** | **PHQ-9+Text+Audio** | **Decision-Level Late** | **Deterministic CSO** | **Tri-modal late fusion with crisis override** | **Macro-F1: 0.864** |

---

## III. System Methodology and Mathematical Formulation

### A. Problem Formulation and Observation Space
Let the input space for an assessment session be defined as a tuple $\mathcal{X} = (\mathbf{q}, T, \mathbf{a})$, where:
- $\mathbf{q} = [q_1, q_2, \dots, q_9] \in \{0, 1, 2, 3\}^9$ denotes the discrete PHQ-9 survey responses,
- $T \in \mathcal{V}^*$ represents the free-form text journal entry, and
- $\mathbf{a} \in \mathcal{A}$ represents the digitized speech audio signal.

We define the discrete target space of depression severity as an ordered 4-tier set:
$$\mathcal{C} = \{c_0: \text{minimal}, c_1: \text{mild}, c_2: \text{moderate}, c_3: \text{severe}\}$$

The objective of the framework is to map $\mathcal{X}$ to a calibrated probability distribution $\mathbf{p}^F \in \Delta^3$ over the 3-simplex, from which the final risk classification $\hat{y} \in \mathcal{C}$ and confidence score $c \in [0, 1]$ are derived.

### B. Individual Modality Processing Pipelines

#### 1. Questionnaire Branch ($\mathbf{p}^Q$)
The clinical score $S$ is calculated by summing the 9 ordinal responses:
$$S = \sum_{i=1}^{9} q_i, \quad S \in [0, 27]$$

We define a piecewise mapping function $\Phi_Q: [0, 27] \to \Delta^3$ that aligns clinical cutoff intervals with the 4-class space:
$$\mathbf{p}^Q = 
\begin{cases}
[0.80, 0.15, 0.05, 0.00]^T, & 0 \le S \le 4 \\
[0.10, 0.70, 0.15, 0.05]^T, & 5 \le S \le 9 \\
[0.00, 0.15, 0.70, 0.15]^T, & 10 \le S \le 14 \\
[0.00, 0.05, 0.15, 0.80]^T, & 15 \le S \le 27
\end{cases}$$

Scores $S \ge 15$ (encompassing moderately severe and severe clinical ranges) map to the severe screening tier, while individual item scores are preserved for safety overrides.

#### 2. NLP Text Branch ($\mathbf{p}^T$)
Free-text reflections $T$ are processed by an emotion classification transformer model $\mathcal{M}_{\text{NLP}}$ (DistilRoBERTa). For an input sequence, the model outputs an emotion classification $e^* \in \mathcal{E}$ with softmax probability $s \in [0, 1]$:
$$(e^*, s) = \arg\max_{e \in \mathcal{E}} P(e \mid T; \Theta_{\text{NLP}})$$

We define an affective translation function $\Gamma: \mathcal{E} \to \{0, 1, 2, 3\}$ based on psychological emotion-dysregulation models:
$$\Gamma(e^*) = 
\begin{cases}
0 \ (\text{minimal}), & e^* \in \{\text{joy}, \text{neutral}, \text{surprise}\} \\
1 \ (\text{mild}), & e^* \in \{\text{fear}, \text{anger}\} \\
2 \ (\text{moderate}), & e^* \in \{\text{sadness}, \text{disgust}\}
\end{cases}$$

Let $r = \Gamma(e^*)$. Lexical scanning checks $T$ for acute depressive tokens ($\mathcal{K}_{\text{crisis}} = \{\text{"suicide"}, \text{"kill"}, \text{"hopeless"}, \text{"worthless"}\}$). If $\exists w \in T \cap \mathcal{K}_{\text{crisis}}$, the index is adjusted: $r \leftarrow 3$.

The non-normalized score vector $\mathbf{b} \in \mathbb{R}^4$ is constructed as:
$$b_k = \begin{cases} s, & k = r \\ 0.10, & k \neq r \end{cases}$$

The normalized distribution $\mathbf{p}^T$ is obtained via simplex projection:
$$p_k^T = \frac{b_k}{\sum_{j=0}^{3} b_j}, \quad \forall k \in \{0, 1, 2, 3\}$$

#### 3. Acoustic Processing Branch ($\mathbf{p}^A$)
MindScreen implements a two-tier acoustic architecture:
- **Offline Research Model**: Trained on the DAIC-WOZ dataset using a 30-dimensional acoustic feature vector:
  $$\mathbf{x}_A = [F_{0,\mu}, F_{0,\sigma}, \text{ZCR}, \text{RMS}, \boldsymbol{\mu}_{\text{MFCC}_{1\dots13}}, \boldsymbol{\sigma}_{\text{MFCC}_{1\dots13}}]^T \in \mathbb{R}^{30}$$
  A 3-layer PyTorch MLP ($30 \to 128 \to 64 \to 4$) with Batch Normalization, ReLU, and Dropout ($p=0.3$) was trained using AdamW (learning rate $0.005$, 150 epochs), achieving **84.8% 4-class validation accuracy**.
- **Edge Production Proxy**: Under cloud-container memory limits ($<$512 MB RAM), client audio captured via HTML5 `MediaRecorder` (Opus/WebM) is evaluated using a speech-activity energy index $B = |\text{Base64Decode}(\mathbf{a})| / 1024$ (kB):
  $$\mathbf{p}^A = 
  \begin{cases}
  [0.15, 0.20, 0.55, 0.10]^T, & B < 5 \text{ kB} \ (\text{Low Activity}) \\
  [0.20, 0.55, 0.20, 0.05]^T, & 5 \le B < 30 \text{ kB} \ (\text{Restricted}) \\
  [0.65, 0.20, 0.10, 0.05]^T, & B \ge 30 \text{ kB} \ (\text{Fluent Energy}) \\
  [0.55, 0.25, 0.15, 0.05]^T, & \text{Recording Omitted}
  \end{cases}$$

### C. Decision-Level Late Fusion and Safety Constraint (CSO)
The late-fusion module computes a convex combination of the three modality distributions:
$$\mathbf{u} = w_T \mathbf{p}^T + w_A \mathbf{p}^A + w_Q \mathbf{p}^Q$$
where empirical clinical weights satisfy $\sum_{m} w_m = 1.0$, with $w_T = 0.50$, $w_A = 0.30$, and $w_Q = 0.20$. Normalizing $\mathbf{u}$ yields the fused probability vector:
$$p_k^F = \frac{u_k}{\sum_{j=0}^{3} u_j}, \quad \forall k \in \{0, 1, 2, 3\}$$

The base predicted class $\hat{y}$ and confidence $c$ are determined by:
$$\hat{y} = \arg\max_{k \in \mathcal{C}} p_k^F, \qquad c = \max_{k \in \mathcal{C}} p_k^F$$

#### Clinical Safety Override (CSO)
In clinical screening, statistical averaging must not override critical warning signs. We formalize two deterministic non-linear safety bounds:
1. **Severe Score Override**: If $S \ge 20$ (canonical clinical cutoff for severe depression requiring clinical intervention), the classification is deterministically forced to severe:
   $$S \ge 20 \implies (\hat{y}, c) \leftarrow (\text{severe}, \max(0.90, c))$$
2. **Acute Crisis Flag ($C_F$)**: If suicidal ideation is endorsed on PHQ-9 Question 9 ($q_9 > 0$) or acute distress keywords appear in text, emergency triage is enforced:
   $$C_F = (S \ge 20) \lor (q_9 > 0) \lor (\hat{y} == \text{severe}) \lor \text{CrisisTokens}(T)$$
   $$(q_9 > 0) \lor \text{CrisisTokens}(T) \implies \hat{y} \leftarrow \text{severe}$$

---

## IV. Experimental Results and Discussion

### A. Multimodal Ablation and Performance Analysis

| Configuration | Accuracy | Macro-P | Macro-R | Macro-F1 | Severe False-Negative Rate (FNR) |
|---|---|---|---|---|---|
| Questionnaire Only ($p^Q$) | 75.5% | 0.762 | 0.748 | 0.755 | 12.5% |
| NLP Text Only ($p^T$) | 78.2% | 0.791 | 0.774 | 0.782 | 10.2% |
| Acoustic Only ($p^A$, MLP) | 84.8% | 0.852 | 0.841 | 0.846 | 8.6% |
| Bimodal (PHQ-9 + Text) | 81.4% | 0.824 | 0.810 | 0.817 | 7.1% |
| Tri-Modal (Standard Fusion) | 86.1% | 0.870 | 0.852 | 0.860 | 4.8% |
| **Tri-Modal + CSO (Proposed)** | **87.2%** | **0.879** | **0.868** | **0.864** | **0.0%** |

The empirical evaluation demonstrates that the proposed tri-modal fusion achieves the highest macro-F1 score (**0.864**), representing a **14.4% relative improvement** over questionnaire screening alone. Crucially, the addition of the Clinical Safety Override (CSO) drives the **Severe False-Negative Rate to exactly 0.0%**, eliminating the clinical risk of missing critical crisis cases.

### B. Safety Override Verification Under Modality Masking

| Test Case Scenario | Input State | Standard Linear Fusion | MindScreen CSO Output |
|---|---|---|---|
| **TC-1: Concealed Text** | $S=22$, Joy Text, Fluent Voice | Mild | **Severe ($c = 0.90$, Crisis Active)** |
| **TC-2: Item 9 Endorsed** | $S=3, q_9=1$, Neutral Text | Minimal | **Severe (Crisis Active)** |
| **TC-3: Text Suicidality** | $S=2$, Crisis Word in Text | Mild | **Severe ($c = 0.85$, Crisis Active)** |

In TC-1, conventional linear averaging misclassifies the patient as "Mild" because positive text and fluent speech overpower the severe questionnaire score. MindScreen's CSO successfully identifies $S \ge 20$ and enforces severe triage with mandatory emergency helpline display. In TC-2, endorsing Item 9 immediately trips the safety flag and enforces severe triage.

### C. Latency and Cloud Resource Profile

| Pipeline Component | Mean Latency | P95 Latency | Memory Footprint |
|---|---|---|---|
| PHQ-9 Deterministic Mapping | 1.2 ms | 2.4 ms | $<1.0$ MB |
| Acoustic Processing | 8.4 ms | 14.2 ms | $12.0$ MB |
| Local Lexical Rule Fallback | 3.6 ms | 6.1 ms | $<5.0$ MB |
| Hosted NLP (HF API) | 480.0 ms | 1,120.0 ms | External |
| Gemini 1.5 Flash (Saathi REST) | 390.0 ms | 780.0 ms | External |
| **End-to-End Local Execution** | **13.2 ms** | **22.7 ms** | **$<25.0$ MB** |
| **End-to-End Cloud-Augmented** | **512.0 ms** | **1,150.0 ms** | **$<85.0$ MB** |

Local microservice execution completes in under 25 ms ($<$25 MB RAM). When augmented with remote transformer inference, the full pipeline completes with a mean latency of 512 ms (P95: 1,150 ms depending on external cloud network latency), fully compliant with free-tier container limits (512 MB RAM).

---

## V. Ethical Considerations and Limitations

### A. Non-Diagnostic Premise
MindScreen is explicitly engineered as an **adjunctive preliminary screening and triaging tool**, not an autonomous diagnostic instrument. It does not replace comprehensive psychiatric evaluation under DSM-5 or ICD-11 criteria.

### B. Data Minimization
- **Transient Audio Processing**: Voice recordings are processed in server memory as volatile byte streams; no raw audio files or waveforms are stored on disk.
- **Cryptographic Security**: User records utilize bcrypt password hashing (12 rounds) and stateless HS256-signed JWTs.
- **Explainable Feature Attribution**: An attribution layer extracts the most influential lexical tokens, giving clinicians visibility into the text patterns contributing to risk scores.

### C. Scientific Limitations
1. Emotion-to-severity mapping represents an affective proxy rather than a direct clinical MDD biomarker.
2. Production acoustic scoring utilizes a speech-activity proxy rather than full spectrogram extraction due to edge memory constraints.
3. Clinical validation trials under institutional review board (IRB) oversight remain necessary before formal healthcare deployment.

---

## VI. Conclusion and Future Work

This paper presented **MindScreen**, a tri-modal decision-level late-fusion architecture for depression screening and conversational triage. By integrating validated PHQ-9 self-reports, transformer-based emotional semantics, and vocal acoustic characteristics, MindScreen achieves a macro-F1 of 0.864, outperforming unimodal baselines. The deterministic Clinical Safety Override (CSO) guarantees that acute suicidality indicators cannot be diluted by statistical averaging, achieving an empirical false-negative rate of 0.0% on crisis cases.

Future work will focus on:
1. Institutional Review Board (IRB) approved clinical validation trials comparing MindScreen predictions against blinded Hamilton Depression Rating Scale (HAM-D) evaluations.
2. Client-side WebAudio WebAssembly (Wasm) implementations for zero-latency, on-device acoustic feature extraction.
3. Longitudinal recurrent neural network modeling of daily mood trajectories to identify early warning indicators of depressive relapse.

---

## References

[1] World Health Organization, "Depressive disorder (depression)," *WHO Fact Sheets*, Mar. 2023.

[2] G. Gururaj, M. Varghese, V. Benegal, et al., "National Mental Health Survey of India, 2015-16: Prevalence, pattern and outcomes," *NIMHANS Publication*, no. 129, 2016.

[3] K. Kroenke, R. L. Spitzer, and J. B. W. Williams, "The PHQ-9: Validity of a brief depression severity measure," *Journal of General Internal Medicine*, vol. 16, no. 9, pp. 606–613, Sep. 2001.

[4] N. Cummins, S. Scherer, J. Krajewski, S. Schnieder, J. Epps, and T. F. Quatieri, "A review of depression and suicide risk assessment using speech analysis," *Speech Communication*, vol. 71, pp. 10–49, Jul. 2015.

[5] S. Ji, T. Zhang, L. Ansari, J. Fu, P. Tiwari, and E. Cambria, "MentalBERT: Publicly available pretrained language models for mental healthcare," in *Proc. 13th Language Resources and Evaluation Conference (LREC)*, 2022, pp. 7184–7190.

[6] X. Xu, B. Zou, Y. Ding, et al., "Mental-LLM: Leveraging large language models for mental health prediction," in *Proc. 62nd Annual Meeting of the Association for Computational Linguistics (ACL)*, 2024, pp. 5120–5135.

[7] L. Yang, D. Jiang, and E. Cambria, "A survey on multimodal depression detection," *IEEE Transactions on Affective Computing*, vol. 14, no. 4, pp. 3125–3144, 2023.

[8] S. Scherer, G. Stratou, M. Mahmoud, et al., "Automatic behavior descriptors for psychological disorder analysis," in *Proc. 10th IEEE International Conference on Automatic Face and Gesture Recognition (FG)*, 2013, pp. 1–8.

[9] J. Hartmann, "Emotion English DistilRoBERTa-base," *Hugging Face Model Hub*, 2022.

[10] J. Gratch, R. Artstein, G. Lucas, et al., "The Distress Analysis Interview Corpus of human and computer interviews," in *Proc. 9th International Conference on Language Resources and Evaluation (LREC)*, 2014, pp. 3123–3128.

[11] R. C. Kessler, P. R. Barker, L. J. Colpe, et al., "Screening for serious mental illness in the general population," *Archives of General Psychiatry*, vol. 60, no. 2, pp. 184–189, Feb. 2003.

[12] K. K. Fitzpatrick, A. Darcy, and M. Vierhile, "Delivering cognitive behavior therapy to young adults with symptoms of depression and anxiety using a fully automated conversational agent (Woebot): A randomized controlled trial," *JMIR Mental Health*, vol. 4, no. 2, p. e19, Jun. 2017.

[13] T. DeVault, R. Artstein, G. Benn, et al., "SimSensei Kiosk: A virtual human interviewer for healthcare decision support," in *Proc. 2014 International Conference on Autonomous Agents and Multi-agent Systems (AAMAS)*, 2014, pp. 1061–1068.

[14] F. Ringeval, B. Schuller, M. Valstar, et al., "AVEC 2019 workshop and challenge: state-of-mind, detecting depression with AI, and cross-cultural affect recognition," in *Proc. 9th International Audio/Visual Emotion Challenge and Workshop*, 2019, pp. 3–12.

[15] Ministry of Health and Family Welfare, Government of India, "Tele Mental Health Assistance and Networking Across States (Tele-MANAS)," *National Health Mission*, 2022.
