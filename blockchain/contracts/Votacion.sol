pragma solidity ^0.5.16;

contract Votacion{
    //objeto Candidato
    struct candidato{
        uint id;
        string nombre;
        uint cantidad_votos;
    }
    //numero de candidatos
    uint public numero_candidatos;
    //almacenamiento direcciones de los votantes
    mapping(address => bool) public votantes;
    //almacenamiento de candidatos
    mapping(uint => candidato) public candidatos;
    //Inicializa los candidatos
    constructor () public {
        agregarCandidato("Candidate 1");
        agregarCandidato("Candidate 2");
    }
    function agregarCandidato (string memory _nombre) private {
        numero_candidatos++;
        candidatos[numero_candidatos] = candidato(numero_candidatos, _nombre, 0);
    }

    event votoEvent (
        uint indexed _idCandidato
    );
    function votar (uint _idCandidato) public {
        //verifica 1 voto por cuenta
        require(!votantes[msg.sender]);

        //verifica candidato sea valido
        require(_idCandidato > 0 && _idCandidato <= numero_candidatos);

        // record that voter has voted
        votantes[msg.sender] = true;

        // update candidate vote Count
        candidatos[_idCandidato].cantidad_votos ++;

        // trigger voted event
        emit votoEvent(_idCandidato);
    }


}