import os
from supabase import create_client, Client
from flask import current_app
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    try:
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_ANON_KEY')
        
        if not supabase_url or not supabase_key:
            logger.warning("Supabase credentials not found, using mock data")
            return None
            
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {str(e)}")
        return None

def init_database():
    """Initialize database tables if they don't exist"""
    client = get_supabase_client()
    if not client:
        logger.warning("Supabase not available, skipping database initialization")
        return
    
    try:
        # Create tables using SQL
        sql_commands = [
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                avatar TEXT,
                points INTEGER DEFAULT 0,
                rank INTEGER DEFAULT 0,
                streak INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                date TIMESTAMP NOT NULL,
                location VARCHAR(255),
                image TEXT,
                host VARCHAR(255),
                description TEXT,
                max_capacity INTEGER,
                points INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS check_ins (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                event_id INTEGER REFERENCES events(id),
                timestamp TIMESTAMP DEFAULT NOW(),
                points_earned INTEGER DEFAULT 0
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS waitlist (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                student_id VARCHAR(20) UNIQUE NOT NULL,
                phone VARCHAR(20),
                graduation_year INTEGER,
                major VARCHAR(100),
                interests TEXT[],
                referral_source VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW(),
                status VARCHAR(20) DEFAULT 'pending'
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS prizes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image TEXT,
                point_cost INTEGER NOT NULL,
                claimed_by INTEGER REFERENCES users(id),
                status VARCHAR(20) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT NOW()
            );
            """
        ]
        
        for sql in sql_commands:
            client.table('users').execute(sql)  # Using any table to execute raw SQL
            
        logger.info("Database tables initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")

def get_user_by_email(email: str):
    """Get user by email"""
    client = get_supabase_client()
    if not client:
        return None
    
    try:
        response = client.table('users').select('*').eq('email', email).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        return None

def create_user(user_data: dict):
    """Create a new user"""
    client = get_supabase_client()
    if not client:
        return None
    
    try:
        response = client.table('users').insert(user_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return None

def add_to_waitlist(waitlist_data: dict):
    """Add user to waitlist"""
    client = get_supabase_client()
    if not client:
        return None
    
    try:
        response = client.table('waitlist').insert(waitlist_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error adding to waitlist: {str(e)}")
        return None

def get_waitlist_count():
    """Get total waitlist count"""
    client = get_supabase_client()
    if not client:
        return 0
    
    try:
        response = client.table('waitlist').select('id', count='exact').execute()
        return response.count or 0
    except Exception as e:
        logger.error(f"Error getting waitlist count: {str(e)}")
        return 0