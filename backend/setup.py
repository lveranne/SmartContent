from setuptools import find_packages, setup

setup(
    name="smartcontent-backend",
    version="1.0.0",
    description="SmartContent recommendation API — User-Based Collaborative Filtering for multimedia catalogs",
    packages=find_packages(),
    python_requires=">=3.10",
    install_requires=[
        "flask>=3.0.0",
        "flask-cors>=4.0.0",
        "flask-socketio>=5.3.0",
        "pymongo>=4.6.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "numpy>=1.26.0",
        "pandas>=2.1.0",
        "scikit-learn>=1.4.0",
        "scipy>=1.12.0",
        "PyJWT>=2.8.0",
    ],
    entry_points={
        "console_scripts": [
            "smartcontent-api=app:main",
        ],
    },
)
