from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, EmployeeDB, AttendanceDB
from schemas import EmployeeCreate, AttendanceCreate
from sqlalchemy.exc import IntegrityError

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows Vercel frontend to connect
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/employees/", status_code=201)
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = EmployeeDB(**emp.dict())
    try:
        db.add(db_emp)
        db.commit()
        db.refresh(db_emp)
        return db_emp
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Employee ID or Email already exists")

@app.get("/api/employees/")
def get_employees(db: Session = Depends(get_db)):
    return db.query(EmployeeDB).all()

@app.delete("/api/employees/{id}", status_code=204)
def delete_employee(id: int, db: Session = Depends(get_db)):
    emp = db.query(EmployeeDB).filter(EmployeeDB.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"message": "Deleted successfully"}

# Adding Attendance endpoints similarly (POST /attendance, GET /attendance/{emp_id})

from schemas import AttendanceCreate
from database import AttendanceDB

@app.post("/api/attendance/", status_code=201)
def mark_attendance(att: AttendanceCreate, db: Session = Depends(get_db)):
    db_att = AttendanceDB(**att.dict())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att

@app.get("/api/attendance/{emp_id}")
def get_attendance(emp_id: int, db: Session = Depends(get_db)):
    records = db.query(AttendanceDB).filter(AttendanceDB.employee_id == emp_id).order_by(AttendanceDB.date.desc()).all()
    return records