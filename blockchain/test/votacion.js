var votacion = artifacts.require("./Votacion.sol");

contract("votacion", function(accounts) {
  var instancia_contrato;

  it("Inicializar con dos candidatos", function() {
    return votacion.deployed().then(function(instance) {
      return instance.numero_candidatos();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("Inicializar los candidatos con los valores correctos", function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      return instancia_contrato.candidatos(1);
    }).then(function(candidato) {
      assert.equal(candidato[0], 1, "contains the correct id");
      assert.equal(candidato[1], "Candidate 1", "contains the correct name");
      assert.equal(candidato[2], 0, "contains the correct votars count");
      return instancia_contrato.candidatos(2);
    }).then(function(candidato) {
      assert.equal(candidato[0], 2, "contains the correct id");
      assert.equal(candidato[1], "Candidate 2", "contains the correct name");
      assert.equal(candidato[2], 0, "contains the correct votars count");
    });
  });

  it("Funcion de votar funcionando correctamente", function() {
    return votacion.deployed().then(function(instance) {
      instancia_contrato = instance;
      candidato_id = 1;
      return instancia_contrato.votar(candidato_id, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votoEvent", "Ingreso al evento correcto");
      assert.equal(receipt.logs[0].args._idCandidato.toNumber(), candidato_id, "the candidato id is correct");
      return instancia_contrato.votantes(accounts[0]);
    }).then(function(votar) {
      assert(votar, "the votarr was marked as votard");
      return instancia_contrato.candidatos(candidato_id);
    }).then(function(candidato) {
      var cantidad_votos = candidato[2];
      assert.equal(cantidad_votos, 1, "increments the candidato's votar count");
    })
  });

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
});
