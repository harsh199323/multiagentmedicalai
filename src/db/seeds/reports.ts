import { db } from '@/db';
import { reports } from '@/db/schema';

async function main() {
    const sampleMedicalReports = [
        {
            patientInfo: '65-year-old male presented with crushing chest pain radiating to left arm. Associated with diaphoresis and nausea. ECG shows ST elevation in leads II, III, aVF. Vitals: BP 160/95, HR 95. History of hypertension and hyperlipidemia.',
            agentResults: [
                {
                    agent: 'DiagnosticAgent',
                    specialty: 'Cardiology',
                    model: 'GPT-4',
                    analysis: 'ST elevation consistent with inferior wall MI. Cardiac biomarkers likely elevated. Emergent cardiac catheterization indicated.',
                    response_time: '1.3s'
                },
                {
                    agent: 'TreatmentAgent',
                    specialty: 'Internal Medicine',
                    model: 'Claude-3',
                    analysis: 'Recommend aspirin 325mg, clopidogrel 600mg loading, atorvastatin 80mg. Consider thrombolysis if cath lab unavailable within 90 minutes.',
                    response_time: '0.9s'
                },
                {
                    agent: 'RiskAssessmentAgent',
                    specialty: 'Cardiology',
                    model: 'Gemini-Pro',
                    analysis: 'STEMI with moderate risk profile. Monitor for arrhythmias. Likely single-vessel disease given inferior involvement. Post-rehabilitation prognosis good with adherence.',
                    response_time: '2.1s'
                }
            ],
            summary: 'Patient presents with an evolving ST-elevation myocardial infarction affecting the inferior wall, confirmed by classic ECG findings. The diagnostic pattern including reciprocal ST depression in aVL strongly supports acute coronary occlusion. Management requires immediate reperfusion therapy with consideration of primary PCI versus thrombolysis based on availability. Early recognition and treatment within the golden window significantly improves long-term prognosis, though close monitoring for complications like arrhythmias or cardiogenic shock is essential during the acute phase.',
            title: 'Inferior Wall STEMI Case',
            createdAt: new Date('2024-01-18T08:30:00').getTime(),
            updatedAt: new Date('2024-01-18T08:30:00').getTime()
        },
        {
            patientInfo: '42-year-old female with progressive dyspnea and dry cough over 3 weeks. Decreased exercise tolerance and chest tightness. HRCT chest shows bilateral ground glass opacities with crazy paving pattern. No fever or weight loss. History of rheumatoid arthritis.',
            agentResults: [
                {
                    agent: 'DiagnosticAgent',
                    specialty: 'Radiology',
                    model: 'GPT-4',
                    analysis: 'Ground glass opacities with crazy paving highly suggestive of pulmonary alveolar proteinosis or atypical infection. Consider autoimmune pneumonitis given RA history.',
                    response_time: '1.7s'
                },
                {
                    agent: 'TreatmentAgent',
                    specialty: 'Pulmonology',
                    model: 'Claude-3',
                    analysis: 'Bronchoalveolar lavage indicated to exclude infection, especially pneumocystis. Consider serologies for connective tissue diseases. Trial of corticosteroids.',
                    response_time: '1.1s'
                },
                {
                    agent: 'RiskAssessmentAgent',
                    specialty: 'Internal Medicine',
                    model: 'Gemini-Pro',
                    analysis: 'Mild restrictive pattern on PFTs. Overall good prognosis with treatment. May require immunosuppression if autoimmune etiology confirmed.',
                    response_time: '1.9s'
                }
            ],
            summary: 'The differential for bilateral ground glass opacities in this middle-aged patient is broad, spanning infectious, autoimmune, and infiltrative etiologies. The crazy paving pattern is classic but nonspecific, requiring bronchoscopy with BAL for definitive diagnosis given her immunocompromised state from rheumatoid arthritis. The combination of subacute presentation without systemic symptoms makes autoimmune pneumonitis or opportunistic infection more likely than organizing pneumonia. Treatment approach should be directed by findings, though empirical corticosteroids may be considered if infection is excluded.',
            title: 'Bilateral Ground Glass Opacities Case',
            createdAt: new Date('2024-01-20T14:15:00').getTime(),
            updatedAt: new Date('2024-01-20T14:15:00').getTime()
        },
        {
            patientInfo: '28-year-old woman with new onset thunderclap headache and photophobia. CT shows subarachnoid hemorrhage with blood in both Sylvian fissures and basal cisterns. GCS 14, mild neck stiffness. History of oral contraceptive use and cigarette smoking.',
            agentResults: [
                {
                    agent: 'DiagnosticAgent',
                    specialty: 'Radiology',
                    model: 'GPT-4',
                    analysis: 'Diffuse SAH pattern concerning for aneurysmal bleed. CTA recommended to identify source. Blood distribution suggests middle cerebral artery or anterior communicating artery aneurysm.',
                    response_time: '0.8s'
                },
                {
                    agent: 'TreatmentAgent',
                    specialty: 'Neurosurgery',
                    model: 'Claude-3',
                    analysis: 'Admit to NSICU for monitoring. Start nimodipine 60mg Q4H for vasospasm prevention. Angiogram within 24-48 hours for definitive treatment.',
                    response_time: '1.4s'
                },
                {
                    agent: 'RiskAssessmentAgent',
                    specialty: 'Neurology',
                    model: 'Gemini-Pro',
                    analysis: 'Modified Fisher Grade 4 indicating high vasospasm risk. Prognosis depends on Hunt-Hess grade and treatment timeliness. Overall 30% mortality.',
                    response_time: '2.3s'
                }
            ],
            summary: "This young woman presents with a Hunt-Hess Grade 2 subarachnoid hemorrhage, most likely aneurysmal given the diffuse distribution in the basal cisterns and Sylvian fissures. Her young age and relatively good neurologic status favor a favorable outcome with appropriate intervention. The modified Fisher Grade 4 designation indicates the highest risk for delayed cerebral ischemia from vasospasm requiring close monitoring and potential intervention. Early aneurysm obliteration combined with aggressive medical management including nimodipine and careful fluid balance can substantially improve her prognosis compared to the historic mortality rates.",
            title: 'Subarachnoid Hemorrhage Case',
            createdAt: new Date('2024-01-22T03:45:00').getTime(),
            updatedAt: new Date('2024-01-22T03:45:00').getTime()
        }
    ];

    await db.insert(reports).values(sampleMedicalReports);
    
    console.log('✅ Medical reports seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});