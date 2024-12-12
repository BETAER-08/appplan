$(document).ready(function () {
    // 음극 및 양극 재료 로드
    loadMaterials();

    function loadMaterials() {
        const anodeSelect = $('#anode');
        const cathodeSelect = $('#cathode');

        // 음극 재료 추가
        for (const category in materialsData.anode_materials) {
            for (const material in materialsData.anode_materials[category]) {
                anodeSelect.append(new Option(material, material));
            }
        }

        // 양극 재료 추가
        for (const category in materialsData.cathode_materials) {
            for (const material in materialsData.cathode_materials[category]) {
                cathodeSelect.append(new Option(material, material));
            }
        }
    }

    // 슬라이더 값 업데이트
    $('#supply_voltage').on('input', function () {
        $('#voltageValue').text($(this).val() + ' V');
    });

    $('#batteryForm').on('submit', function (e) {
        e.preventDefault();

        const anode = $('#anode').val();
        const cathode = $('#cathode').val();
        const supplyVoltage = parseFloat($('#supply_voltage').val());

        // 전위 가져오기
        const anodePotential = materialsData.anode_materials["금속 원소"][anode]?.potential || materialsData.anode_materials["금속 산화물"][anode]?.potential;
        const cathodePotential = materialsData.cathode_materials["금속 원소"][cathode]?.potential || materialsData.cathode_materials["금속 산화물"][cathode]?.potential;

        // 전위가 유효한지 확인
        if (anodePotential === undefined || cathodePotential === undefined) {
            $('#result').html('<p style="color:red;">잘못된 재료 선택입니다.</p>');
            return;
        }

        // 전압 계산
        const cellPotential = cathodePotential - anodePotential;
        const efficiency = (cellPotential / supplyVoltage) * 100;

        // 결과 표시
        $('#result').html(`
            이론적 전압: ${cellPotential.toFixed(2)} V<br>
            효율: ${efficiency.toFixed(2)}%<br>
            공급 전압: ${supplyVoltage} V
        `);

        // 수식 표시
        $('#formula').html(`전압 수식: $$E_{cell} = E_{cathode} - E_{anode} = ${cathodePotential} - ${anodePotential}$$`).show();
        $('#efficiencyFormula').html(`효율 수식: $$Efficiency = \\frac{E_{cell}}{E_{supply}} \\times 100 = \\frac{${cellPotential}}{${supplyVoltage}} \\times 100$$`).show();
        MathJax.typeset();
    });
});
