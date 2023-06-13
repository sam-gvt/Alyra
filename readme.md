Ce qui a été fait :

- avant chaque test, creation d'une instance de contrat
- enregistrement d'un voteur
- enregistrement des propositions
- enregistrement(incrementation) vote pour proposition
- retour de la proposition gagnante

Verification de revert sur :

- enregistrement de 2 memes voteur
- changement de workflow par un voteur
- depassement du nombre de valeur de l'enum
- enregistrement de plusieurs vote par un meme voteur

Verification des expectEvent : 
- tous sauf celui du workflow (pas reussi)
