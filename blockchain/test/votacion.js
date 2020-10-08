var votacion = artifacts.require("./Votacion.sol");

contract("votacion", function(accounts) {
  var instancia_contrato;

  it("Inicializar voto en blanco", function() {
    return votacion.deployed().then(function(instance) {
      return instance.numero_candidatos();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("Inicializar voto en blanco con los valores correctos", function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      return instancia_contrato.candidatos(1);
    }).then(function(candidato) {
      assert.equal(candidato[0], 1, "Id correcto");
      assert.equal(candidato[1], "-", "Nombre Correcto");
      assert.equal(candidato[2], 0, "Votos correctos");
      assert.equal(candidato[3], "images/voto-blanco.jpeg", "Imagen correcta");
      assert.equal(candidato[4], "-", "Informacion correcta");
  });
});
for(let iteraciones=1;iteraciones<=51;iteraciones++){
  it("voto # "+iteraciones, function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      candidato_id = 1;
      return instancia_contrato.votarTest(candidato_id, { from: accounts[1] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "Evento funcionando");
      assert.equal(receipt.logs[0].event, "votoEvent", "Ingreso al evento correcto");
      assert.equal(receipt.logs[0].args._idCandidato.toNumber(), candidato_id, "El id del candidato es correcto");
      return true;
    }).then(function(votarTest) {
      assert(votarTest, "Votacion");
      return instancia_contrato.candidatos(candidato_id);
    });
  });
}
  
  it("comparar cantidad votos", function() {
    return votacion.deployed().then(function(instance) {
      return instance.candidatos(1);
    }).then(function(candidato) {
      var cantidad_votos = candidato[2];
      assert.equal(cantidad_votos,50 );
    });
  });

/*
  it("Capturar exepcion para candidatos no validos", function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      return instancia_contrato.votar(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return instancia_contrato.candidatos(1);
    }).then(function(candidate1) {
      var cantidad_votos = candidate1[2];
      assert.equal(cantidad_votos, 1, "candidato 1 did not receive any votars");
      return instancia_contrato.candidatos(2);
    }).then(function(candidate2) {
      var cantidad_votos = candidate2[2];
      assert.equal(cantidad_votos, 0, "candidato 2 did not receive any votars");
    });
  });

  it("Capturar exepcion para votacion doble", function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      candidato_id = 2;
      instancia_contrato.votar(candidato_id, { from: accounts[1] });
      return instancia_contrato.candidatos(candidato_id);
    }).then(function(candidato) {
      var cantidad_votos = candidato[2];
      assert.equal(cantidad_votos, 1, "accepts first votar");
      // Votar de nuevo
      return instancia_contrato.votar(candidato_id, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return instancia_contrato.candidatos(1);
    }).then(function(candidate1) {
      var cantidad_votos = candidate1[2];
      assert.equal(cantidad_votos, 1, "candidato 1 did not receive any votars");
      return instancia_contrato.candidatos(2);
    }).then(function(candidate2) {
      var cantidad_votos = candidate2[2];
      assert.equal(cantidad_votos, 1, "candidato 2 did not receive any votars");
    });
  });
  */
});
