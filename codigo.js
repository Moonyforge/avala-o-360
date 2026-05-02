// ======================================
// BANCO DE DADOS LOCAL
// ======================================
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];



// ======================================
// CADASTRO
// ======================================
function validarCadastro(){

    let nome = document.getElementById("nome").value.trim();
    let matricula = document.getElementById("matricula").value.trim();
    let curso = document.getElementById("curso").value;
    let periodo = document.getElementById("periodo").value;
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value;

    if(senha.length < 6){
        alert("A senha precisa ter no mínimo 6 caracteres.");
        return false;
    }

    let existe = usuarios.some(u =>
        u.email === email || u.matricula === matricula
    );

    if(existe){
        alert("Email ou matrícula já cadastrados.");
        return false;
    }

    usuarios.push({
        nome,
        matricula,
        curso,
        periodo,
        email,
        senha
    });

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";

    return false;
}



// ======================================
// LOGIN
// ======================================
function validarLogin(){

    usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let login = document.getElementById("login").value.trim();
    let senha = document.getElementById("senha").value;

    let usuario = usuarios.find(u =>
        (u.email === login || u.matricula === login) &&
        u.senha === senha
    );

    if(!usuario){
        alert("Login ou senha inválidos.");
        return false;
    }

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    let sala = usuario.curso + "_p" + usuario.periodo;

    window.location.href = sala + ".html";

    return false;
}



// ======================================
// BLOCO DA SALA / RPG
// só executa se existir #lista
// ======================================
if(document.getElementById("lista")){

    let lista = document.getElementById("lista");

    let usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    let usuarios = JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

    let colegas = usuarios.filter(u =>
        u.curso === usuario.curso &&
        u.periodo === usuario.periodo &&
        u.matricula !== usuario.matricula
    );



    // ======================================
    // LIMITAR NOTA
    // ======================================
    window.limitarNota = function(campo){

        let valor = parseInt(campo.value);

        if(isNaN(valor)){
            campo.value = "";
            return;
        }

        if(valor > 10){
            campo.value = 10;
        }
        else if(valor < 1){
            campo.value = 1;
        }
        else{
            campo.value = valor;
        }
    }



    // ======================================
    // MOSTRAR COLEGAS
    // ======================================
    colegas.forEach(c => {

        lista.innerHTML += `
        <div class="card">

            <h3>⚔️ ${c.nome}</h3>

            <label>🛡 Espírito de Equipe</label>
            <input type="number" min="1" max="10" step="1"
            inputmode="numeric"
            oninput="limitarNota(this)"
            onblur="limitarNota(this)"
            id="eq_${c.matricula}">

            <label>⚡ Agilidade em Missões</label>
            <input type="number" min="1" max="10" step="1"
            inputmode="numeric"
            oninput="limitarNota(this)"
            onblur="limitarNota(this)"
            id="ag_${c.matricula}">

            <label>🧠 Sabedoria Estratégica</label>
            <input type="number" min="1" max="10" step="1"
            inputmode="numeric"
            oninput="limitarNota(this)"
            onblur="limitarNota(this)"
            id="sa_${c.matricula}">

            <label>🔥 Liderança</label>
            <input type="number" min="1" max="10" step="1"
            inputmode="numeric"
            oninput="limitarNota(this)"
            onblur="limitarNota(this)"
            id="li_${c.matricula}">

            <label>📜 Honra</label>
            <input type="number" min="1" max="10" step="1"
            inputmode="numeric"
            oninput="limitarNota(this)"
            onblur="limitarNota(this)"
            id="ho_${c.matricula}">

        </div>
        `;
    });




    // ======================================
    // ENVIAR AVALIAÇÃO JUSTA
    // ======================================
    window.enviarAvaliacoes = function(){

        let avaliacoes = JSON.parse(
            localStorage.getItem("avaliacoes")
        ) || [];

        let jaEnviou = avaliacoes.some(a =>
            a.avaliador === usuario.matricula
        );

        if(jaEnviou){
            alert("Você já enviou sua avaliação.");
            return;
        }

        colegas.forEach(c => {

            let n1 = Number(document.getElementById("eq_"+c.matricula).value);
            let n2 = Number(document.getElementById("ag_"+c.matricula).value);
            let n3 = Number(document.getElementById("sa_"+c.matricula).value);
            let n4 = Number(document.getElementById("li_"+c.matricula).value);
            let n5 = Number(document.getElementById("ho_"+c.matricula).value);

            if(
                n1 < 1 || n1 > 10 ||
                n2 < 1 || n2 > 10 ||
                n3 < 1 || n3 > 10 ||
                n4 < 1 || n4 > 10 ||
                n5 < 1 || n5 > 10
            ){
                alert("Todas as notas devem ser de 1 a 10.");
                return;
            }

            let media = (n1+n2+n3+n4+n5)/5;

            avaliacoes.push({
                avaliador: usuario.matricula,
                avaliado: c.matricula,
                nome: c.nome,
                media: media
            });

        });

        localStorage.setItem(
            "avaliacoes",
            JSON.stringify(avaliacoes)
        );

        alert("⚔️ Avaliação enviada com sucesso!");

        mostrarRanking();
    }




    // ======================================
    // TÍTULOS RPG
    // ======================================
    function titulo(media){

        if(media >= 9) return "👑 Lenda da Guilda";
        if(media >= 8) return "⚔️ Comandante Supremo";
        if(media >= 7) return "🛡 Guardião Real";
        if(media >= 6) return "📜 Cavaleiro";
        if(media >= 5) return "🔥 Aprendiz";

        return "🌑 Recruta";
    }




    // ======================================
    // MOSTRAR RANKING JUSTO
    // ======================================
    function mostrarRanking(){

        let dados = JSON.parse(
            localStorage.getItem("avaliacoes")
        ) || [];

        let resumo = {};

        dados.forEach(item => {

            if(!resumo[item.avaliado]){
                resumo[item.avaliado] = {
                    nome:item.nome,
                    total:0,
                    qtd:0
                };
            }

            resumo[item.avaliado].total += item.media;
            resumo[item.avaliado].qtd++;
        });

        let ranking = [];

        for(let id in resumo){

            ranking.push({
                nome: resumo[id].nome,
                media: resumo[id].total / resumo[id].qtd
            });
        }

        // MELHORES PRIMEIRO
        ranking.sort((a,b)=> b.media-a.media);

        let html = "<h2>🏆 Conselho da Guilda</h2>";

        ranking.forEach(p => {

            html += `
            <div class="rank">
                <h3>${p.nome}</h3>
                <p>Média Final: ${p.media.toFixed(1)}</p>
                <p>${titulo(p.media)}</p>
            </div>
            `;
        });

        lista.innerHTML = html;
    }
}
