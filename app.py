from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
#####BLOCK2
# Créer l'application Flask
app = Flask(__name__)

# Autoriser le frontend à appeler cette API
CORS(app)

# Connexion à la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    'postgresql://admin:secret@db-livres:5432/livres_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)
#######BLOCK3
# La table "livres" dans PostgreSQL
class Livre(db.Model):
    __tablename__ = 'livres'

    id         = db.Column(db.Integer, primary_key=True)
    titre      = db.Column(db.String(255), nullable=False)
    auteur     = db.Column(db.String(255), nullable=False)
    isbn       = db.Column(db.String(20), unique=True, nullable=True)
    disponible = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        return {
            'id':         self.id,
            'titre':      self.titre,
            'auteur':     self.auteur,
            'isbn':       self.isbn,
            'disponible': self.disponible
        }

# Créer la table automatiquement au démarrage
with app.app_context():
    db.create_all()
# Créer la table avec retry (attend que PostgreSQL soit prêt)
import time

def init_db():
    retries = 5
    while retries > 0:
        try:
            with app.app_context():
                db.create_all()
            print("✅ Base de données connectée avec succès !")
            break
        except Exception as e:
            retries -= 1
            print(f"⏳ BDD pas encore prête... tentative restantes : {retries}")
            time.sleep(3)

init_db()    
#######BLOCK4
# ─────────────────────────────────────────
# ROUTE 1 : Lister tous les livres
# GET /api/livres
# ─────────────────────────────────────────
@app.route('/api/livres', methods=['GET'])
def get_livres():
    livres = Livre.query.all()
    return jsonify([l.to_dict() for l in livres]), 200


# ─────────────────────────────────────────
# ROUTE 2 : Rechercher par titre/auteur/ISBN
# GET /api/livres/search?q=python
# ─────────────────────────────────────────
@app.route('/api/livres/search', methods=['GET'])
def search_livres():
    q = request.args.get('q', '').strip()

    if not q:
        return jsonify({'error': 'Paramètre q requis'}), 400

    resultats = Livre.query.filter(
        db.or_(
            Livre.titre.ilike(f'%{q}%'),
            Livre.auteur.ilike(f'%{q}%'),
            Livre.isbn.ilike(f'%{q}%')
        )
    ).all()

    return jsonify([l.to_dict() for l in resultats]), 200
# ─────────────────────────────────────────
# ROUTE 3 : Afficher un seul livre
# GET /api/livres/1
# ─────────────────────────────────────────
@app.route('/api/livres/<int:id>', methods=['GET'])
def get_livre(id):
    livre = Livre.query.get(id)

    if livre is None:
        return jsonify({'error': 'Livre non trouvé'}), 404

    return jsonify(livre.to_dict()), 200


# ─────────────────────────────────────────
# ROUTE 4 : Ajouter un nouveau livre
# POST /api/livres
# Body : {"titre": "...", "auteur": "...", "isbn": "..."}
# ─────────────────────────────────────────
@app.route('/api/livres', methods=['POST'])
def create_livre():
    data = request.get_json()

    # Vérifier que les champs obligatoires sont présents
    if not data or not data.get('titre') or not data.get('auteur'):
        return jsonify({'error': 'titre et auteur sont obligatoires'}), 400

    # Vérifier que l'ISBN n'existe pas déjà
    if data.get('isbn'):
        existant = Livre.query.filter_by(isbn=data['isbn']).first()
        if existant:
            return jsonify({'error': 'ISBN déjà utilisé'}), 409

    nouveau = Livre(
        titre  = data['titre'],
        auteur = data['auteur'],
        isbn   = data.get('isbn')
    )

    db.session.add(nouveau)
    db.session.commit()

    return jsonify({'message': 'Livre créé avec succès', 'id': nouveau.id}), 201
# ─────────────────────────────────────────
# ROUTE 5 : Modifier un livre
# PUT /api/livres/1
# Body : {"titre": "...", "disponible": false}
# ─────────────────────────────────────────
@app.route('/api/livres/<int:id>', methods=['PUT'])
def update_livre(id):
    livre = Livre.query.get(id)

    if livre is None:
        return jsonify({'error': 'Livre non trouvé'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'error': 'Données JSON requises'}), 400

    # Mettre à jour seulement les champs envoyés
    if 'titre'      in data: livre.titre      = data['titre']
    if 'auteur'     in data: livre.auteur     = data['auteur']
    if 'isbn'       in data: livre.isbn       = data['isbn']
    if 'disponible' in data: livre.disponible = data['disponible']

    db.session.commit()

    return jsonify({'message': 'Livre mis à jour', 'livre': livre.to_dict()}), 200


# ─────────────────────────────────────────
# ROUTE 6 : Supprimer un livre
# DELETE /api/livres/1
# ─────────────────────────────────────────
@app.route('/api/livres/<int:id>', methods=['DELETE'])
def delete_livre(id):
    livre = Livre.query.get(id)

    if livre is None:
        return jsonify({'error': 'Livre non trouvé'}), 404

    db.session.delete(livre)
    db.session.commit()

    return jsonify({'message': 'Livre supprimé avec succès'}), 200


# ─────────────────────────────────────────
# Lancement de l'application
# ─────────────────────────────────────────
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
