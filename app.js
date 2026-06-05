document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calc-form');
    const errorBanner = document.getElementById('error-message');
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');

    // Result DOM Elements
    const resTotal = document.getElementById('res-total');
    const resBase = document.getElementById('res-base');
    const resWaste = document.getElementById('res-waste');
    const resLinear = document.getElementById('res-linear');

    // Constants
    const FABRIC_PER_GI_SQ_METERS = 3.2;
    const ROLL_WIDTH_METERS = 1.4986; // 59" in meters
    const WASTE_PERCENTAGE = 8;
    const LIGHTWEIGHT_MAX_GSM = 450;
    const HEAVYWEIGHT_MIN_GSM = 550;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous errors
        errorBanner.classList.add('hidden');
        errorBanner.innerHTML = '';

        // Get values
        const orderQuantity = parseInt(document.getElementById('orderQuantity').value);
        const gsm = parseInt(document.getElementById('gsm').value);
        const weightCategory = document.getElementById('weightCategory').value;

        // Validate
        if (!validateGsm(gsm, weightCategory)) {
            showError(`<strong>GSM MISMATCH ERROR:</strong><br> ${gsm} GSM is not in the ${weightCategory} range.<br><br>
            • Lightweight: ≤ ${LIGHTWEIGHT_MAX_GSM} GSM<br>
            • Heavyweight: ≥ ${HEAVYWEIGHT_MIN_GSM} GSM<br>
            Values in between are considered mid-weight.`);
            hideResults();
            return;
        }

        // Calculate
        const baseFabricSqMeters = orderQuantity * FABRIC_PER_GI_SQ_METERS;
        const wasteAmount = baseFabricSqMeters * (WASTE_PERCENTAGE / 100);
        const totalFabricSqMeters = baseFabricSqMeters + wasteAmount;
        const linearMetersNeeded = totalFabricSqMeters / ROLL_WIDTH_METERS;

        // Display
        displayResults({
            baseFabric: baseFabricSqMeters.toFixed(2),
            waste: wasteAmount.toFixed(2),
            totalFabric: totalFabricSqMeters.toFixed(2),
            linearMeters: linearMetersNeeded.toFixed(2)
        });
    });

    function validateGsm(gsm, category) {
        if (category === "Lightweight") {
            return gsm <= LIGHTWEIGHT_MAX_GSM;
        } else if (category === "Heavyweight") {
            return gsm >= HEAVYWEIGHT_MIN_GSM;
        }
        return false;
    }

    function showError(message) {
        errorBanner.innerHTML = message;
        errorBanner.classList.remove('hidden');
    }

    function displayResults(data) {
        resTotal.innerText = data.totalFabric;
        resBase.innerText = data.baseFabric;
        resWaste.innerText = data.waste;
        resLinear.innerText = data.linearMeters;

        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
    }

    function hideResults() {
        resultsPlaceholder.classList.remove('hidden');
        resultsContent.classList.add('hidden');
    }
});
