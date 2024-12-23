from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb+srv://singhprasant0810:prasant@cluster0.yvocf.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(app)

# Collections
events_collection = mongo.db.events
attendees_collection = mongo.db.attendees
tasks_collection = mongo.db.tasks
users_collection = mongo.db.users

# Helper Function to Format ObjectId
def format_id(document):
    document["_id"] = str(document["_id"])
    return document

# Routes

## User Authentication
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not all(k in data for k in ("username", "password")):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists
    if users_collection.find_one({"username": data["username"]}):
        return jsonify({"error": "Username already exists"}), 409

    # Hash the password
    hashed_password = generate_password_hash(data["password"])
    user = {"username": data["username"], "password": hashed_password}
    user_id = users_collection.insert_one(user).inserted_id

    return jsonify({"message": "User created", "_id": str(user_id)}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not all(k in data for k in ("username", "password")):
        return jsonify({"error": "Missing required fields"}), 400

    # Find the user
    user = users_collection.find_one({"username": data["username"]})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful", "username": user["username"]}), 200

## Event Management
@app.route('/events', methods=['GET'])
def get_events():
    events = events_collection.find()
    formatted_events = [
        {
            "_id": str(event["_id"]),
            "name": event["name"],
            "description": event.get("description", ""),
            "location": event.get("location", ""),
            "date": event["date"],  # Ensure date is already ISO formatted
        }
        for event in events
    ]
    return jsonify(formatted_events), 200


@app.route('/events', methods=['POST'])
def add_event():
    data = request.json
    if not all(k in data for k in ("name", "description", "location", "date")):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Validate and format the date
        event_date = datetime.fromisoformat(data["date"]).isoformat()
        event = {
            "name": data["name"],
            "description": data["description"],
            "location": data["location"],
            "date": event_date
        }
        event_id = events_collection.insert_one(event).inserted_id
        return jsonify({"_id": str(event_id)}), 201
    except ValueError:
        return jsonify({"error": "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)."}), 400


@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    result = events_collection.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Event not found"}), 404
    return jsonify({"message": "Event deleted"}), 200


## Attendee Management
@app.route('/attendees', methods=['GET'])
def get_attendees():
    attendees = attendees_collection.find()
    return jsonify([format_id(attendee) for attendee in attendees]), 200


@app.route('/attendees', methods=['POST'])
def add_attendee():
    data = request.json
    if "name" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    attendee_id = attendees_collection.insert_one(data).inserted_id
    return jsonify({"_id": str(attendee_id)}), 201


@app.route('/attendees/<attendee_id>', methods=['DELETE'])
def delete_attendee(attendee_id):
    result = attendees_collection.delete_one({"_id": ObjectId(attendee_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Attendee not found"}), 404
    return jsonify({"message": "Attendee deleted"}), 200


## Task Management
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = tasks_collection.find()
    return jsonify([format_id(task) for task in tasks]), 200


@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    if not all(k in data for k in ("name", "status", "event_id")):
        return jsonify({"error": "Missing required fields"}), 400
    task_id = tasks_collection.insert_one(data).inserted_id
    return jsonify({"_id": str(task_id)}), 201


@app.route('/tasks/<task_id>', methods=['PATCH'])
def update_task_status(task_id):
    data = request.json
    if "status" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": data["status"]}}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task updated"}), 200


@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task deleted"}), 200


# Run the server
if __name__ == '__main__':
    app.run(debug=True)
