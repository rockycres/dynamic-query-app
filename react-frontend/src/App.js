import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import logo from './banner-image.jpg'; // import the image



const BASE_URL = 'http://localhost:8080';

const useFunctionalities = () => {
    const [functionalities, setFunctionalities] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/functions`)
            .then(res => {
                setFunctionalities(res.data);
            });
    }, []);

    return functionalities;
};

const useSqlQueries = (selectedFunctionality) => {
    const [sqlQueries, setSqlQueries] = useState([]);

    useEffect(() => {
        if (!selectedFunctionality) {
            return;
        }

        axios.get(`${BASE_URL}/api/sqlqueries/${selectedFunctionality}`)
            .then(res => {
                setSqlQueries(res.data);
            });
    }, [selectedFunctionality]);

    return sqlQueries;
};

const useFields = (selectedFunctionality, selectedSqlQuery) => {
    const [fields, setFields] = useState([]);

    useEffect(() => {
        if (!selectedFunctionality && !selectedSqlQuery) return;

        axios.get(`${BASE_URL}/api/fields/${selectedFunctionality}/${selectedSqlQuery}`)
            .then(res => {
                setFields(res.data);
            });
    }, [selectedFunctionality, selectedSqlQuery]);

    return fields;
};

const App = () => {
    const [selectedFunctionality, setSelectedFunctionality] = useState(null);
    const [selectedSqlQuery, setSelectedSqlQuery] = useState(null);
    const [resultMode, setResultMode] = useState([]);
    const functionalities = useFunctionalities();
    const sqlQueries = useSqlQueries(selectedFunctionality);
    const fields = useFields(selectedFunctionality, selectedSqlQuery);

    const handleSubmit = async () => {
        const input = {
            resultMode,
            fields: fields.reduce((fieldsObj, field) => {
                fieldsObj[field.fieldName] = field.fieldValue;
                return fieldsObj;
            }, {}),
            selectedQuery: selectedSqlQuery,
            selectedFunction: selectedFunctionality
        };

        try {
            await axios.post(`${BASE_URL}/api/submit`, input);
            console.log('Successfully submitted!');
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div style={{
            backgroundColor: "#eee",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh"
        }}>

            <header style={{ backgroundColor: '#3F51B5', padding: 20 }}>
                <img src={logo} alt="logo" />
                <h2 style={{ color: 'white', margin: 0 }}>Header Page</h2>
            </header>

            <div style={{
                backgroundColor: "white",
                width: "50%",
                padding: "2rem",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}>

        <div className="container">
            <div className="row">
                <label htmlFor="selectedFunctionality" className="label">Environment:</label>
                <select
                    id="selectedFunctionality"
                    value={selectedFunctionality || ''}
                    onChange={e => setSelectedFunctionality(e.target.value)}>
                    <option value="">---</option>
                    {functionalities.map(func => (
                        <option key={func.envId} value={func.functionKey}>{func.envKey}</option>))}
                </select>
            </div>
            {selectedFunctionality && (
                <div className="row">
                    <label htmlFor="selectedSqlQuery" className="label">Function:</label>
                    <select id="selectedSqlQuery" onChange={e => setSelectedSqlQuery(e.target.value)}>
                        {sqlQueries.map(query => (
                            <option key={query.functionId} value={query.envKey}>{query.functionKey}</option>))}
                    </select>
                </div>
            )}
            {selectedFunctionality && selectedSqlQuery && (
                <>
                    {fields.map(field => (
                        <div key={field.fieldName} className="row">
                            <label className="label">{field.fieldName}:</label>
                            <input type={field.fieldType === 'String' ? 'text' : field.fieldType.toLowerCase()} />
                        </div>
                    ))}
                    <div className="row">
                        <label className="label">Result Mode:</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="email"
                                    onChange={e => setResultMode(e.target.value)}
                                />
                                Email
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    value="download"
                                    checked
                                    onChange={e => setResultMode(e.target.value)}
                                />
                                Download as Excel
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label" />
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </>
            )}
       {/*     <Footer note="" />
        */}
        </div>
            </div>
        </div>

    );
};
export default App;