import React, { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  SearchBox,
  ResultsSnippet,
  ResultsConfig,
  WindowCard,
  EntityRecord,
  MLContext,
  DataGrid,
  Timeline,
  NumberRangeFacet,
  StringFacet,
  DateRangePicker,
  BucketRangeFacet,
  SelectedFacets,
  CommentBox,
  CommentList,
} from "ml-fasttrack";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import searchBox from "../config/SearchBox.config";
import { selectedFacetConfig } from "../config/SelectedFacet.config";
import { ResultsSnippetConfig } from "../config/ResultsSnippet.config";
import { entityDataGridConfigTemplate } from "../config/DataGrid.config";
import resultsConfig from "../config/ResultsList.config";
import entityRecordConfig from "../config/EntityRecord.config";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeView, setActiveView] = useState("jsonView");
  const [selectedNode, setSelectedNode] = useState(null);
  const [uri, setUri] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [currentRangeValue, setCurrentRangeValue] = useState([]);

  const [valueDateFacet, setValueDateFacet] = useState({ start: new Date(1980, 1, 1), end: new Date(2020, 12, 31) });
  const [rangeFacetValue, setRangeFacetValue] = useState([]);
  const [resetNumberFacet, setResetNumberFacet] = useState(false);
  const [resetStringFacet, setResetStringFacet] = useState("");
  const [resetBucketFacet, setResetBucketFacet] = useState("");
  const [selectedUri, setSelectedUri] = useState('');

  // create a ref
  const myRef = useRef(null);
  const graphRef = useRef(null);

  const context = useContext(MLContext);

  const queryParameters = new URLSearchParams(window.location.search);
  const q = queryParameters.get("q"); // query string
  const c = queryParameters.get("c"); // menu collection

  useLayoutEffect(() => {
    if (myRef.current) {
      setDimensions({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (uri) {
      const result = context.searchResponse.results;
      const selectedItem = result.find((r) => r.uri === uri);
      setSelectedItem(selectedItem);
    }
  }, [uri, context.searchResponse.results]);

  const handleWindowClose = () => {
    console.log(context.documentResponse)
    context.setDocumentResponse(null);
    graphRef?.current?.ping(selectedNode);
    selectedNode && setSelectedNode(null);
  };

  const loading = (
    <div className="loading">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  const handleResultClick = (snippet) => {
    const uri = snippet?.uri ? snippet.uri : snippet.dataItem ? snippet.dataItem.uri : null;
    setSelectedUri(uri);
    if (uri) {
      context.getDocument(uri);
    }
  };

  const handleGoToGraph = (attributes, _event) => {
    const uri = attributes?.uri;
    if (uri) {
      context.getSparql(buildRelationsQuery([uri]));
    }
    setActiveView("networkGraph");
  };

  const handleSearch = (params) => {
    handleWindowClose();
    context.setQtext(params?.q);
    context.setCollections(params?.collections);
  };

  const handleFacetClick = (selection) => {
    console.log("facetClick", selection);
    context.addStringFacetConstraint(selection);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (currentRangeValue.length !== 0) {
        context.addRangeFacetConstraint(currentRangeValue);
      }
    }, 500);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [currentRangeValue]);

  const handleValueRange = (selections) => {
    setResetNumberFacet(false);
    console.log("🚀 ~ Number Range: ", selections);
    setCurrentRangeValue(selections);
  };

  const resetNumberRangeFacet = () => {
    context.removeRangeFacetConstraint(currentRangeValue);
    setCurrentRangeValue([]);
  };

  const resetDateRangeFacet = (e, value, constraint) => {
    console.log("🚀 ~ Reset date range selection: ", e, value, constraint);
    context.removeRangeFacetConstraint(constraint);
    setValueDateFacet({ start: null, end: null });

    if (rangeFacetValue) {
      setRangeFacetValue([]);
      context.removeRangeFacetConstraint(rangeFacetValue);
    }
  };

  //To reset facets by type
  const resetSelectedFacetsComponent = (facet, type) => {
    if (type === "rf") {
      //Number range facet
      if (facet[0]?.type === "number") {
        setResetNumberFacet(true);
      } else {
        //Date range facet
        setValueDateFacet({ start: null, end: null });
      }
      context.removeRangeFacetConstraint(facet);
    } else if (type === "sf") {
      //Bucket facet
      if (facet?.name === "salaryBucketed") {
        setResetBucketFacet(facet?.value[0]);
        context.removeStringFacetConstraint(facet);
      } else {
        //String facet
        setResetStringFacet(facet?.value[0]);
        context.removeStringFacetConstraint(facet);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <Container fluid>
              <div className={"text-center"}>
                <SearchBox
                  menuThemeColor="dark"
                  buttonThemeColor="default"
                  placeholder="Enter query (🦾)"
                  className="ms-auto me-auto my-4"
                  searchSuggest={true}
                  searchSuggestMin={3}
                  searchSuggestSubmit={true}
                  searchSuggestLimit={10}
                  showLoading={true}
                  onSearch={handleSearch}
                  menuItems={searchBox.items}
                  selected={c || 0}
                  value={q || ""}
                  containerStyle={{ width: "640px" }}
                  boxStyle={{ height: 40 }}
                  dropdownItemStyle={{ fontSize: 16 }}
                />
              </div>

              {
                <SelectedFacets
                  selectedFacetConfig={selectedFacetConfig}
                  stringFacets={context.stringFacetConstraints}
                  rangeFacets={context.rangeFacetConstraints}
                  removeStringFacet={(f) => resetSelectedFacetsComponent(f, "sf")}
                  removeRangeFacet={(f) => resetSelectedFacetsComponent(f, "rf")}
                  separator="to"
                ></SelectedFacets>
              }

              <div ref={myRef} style={{ position: "relative" }}>
                {context.documentResponse && (
                  <WindowCard
                    title={
                      <div style={{ fontSize: 18, lineHeight: "1.3em" }}>
                        {context?.documentResponse?.person && <i className="fas fa-user"></i>}
                        {context?.documentResponse?.organization && <i className="fas fa-building"></i>}
                        {context?.documentResponse?.phylum && <i className="fas fa-water"></i>}
                      </div>
                    }
                    draggable={false}
                    appendTo={myRef.current}
                    visible={true}
                    toggleDialog={handleWindowClose}
                    initialLeft={dimensions.width - 465}
                  >
                    <div>
                      <EntityRecord
                        recordActionLabel={"graph"}
                        entity={context.documentResponse}
                        config={entityRecordConfig}
                        multipleValueSeparator={","}
                        onRecordActionClick={handleGoToGraph}
                      />
                    </div>
                  </WindowCard>
                )}
                <Tab.Container id="left-tabs-example" activeKey={activeView}>
                  

                <div class="flex"> 
                        <div class="flex-none m-5">
                          {context.searchResponse?.facets?.Categorie && <StringFacet title="Categorie" name="Categorie" data={context.searchResponse?.facets?.Categorie} onSelect={handleFacetClick} reset={resetStringFacet} />}
                          {context.searchResponse?.facets?.Materiau && <StringFacet title="Materiau" name="Materiau" data={context.searchResponse?.facets?.Materiau} onSelect={handleFacetClick} reset={resetStringFacet} />}
                          {context.searchResponse?.facets?.Type && <StringFacet title="Type" name="Type" data={context.searchResponse?.facets?.Type} onSelect={handleFacetClick} reset={resetStringFacet} />}
                          
                        </div>
                        <div class="flex-1 m-5">
                      <Tab.Content>

                        <Tab.Pane eventKey="resultsConfig">
                        
                       
                      <ResultsConfig
                        results={context.searchResponse.results}
                        onClick={(_event, result) => handleResultClick(result)}
                        config={resultsConfig}
                        multipleValueSeparator={','}
                        headerClassName={"headerContainer"}
                        footerClassName={"footerContainer"}
                        paginationClassName={"paginationContainer"}
                        pagerButtonCount={5}
                        paginationHeader={false}
                        paginationFooter={true}
                        pageSize={10}
                        pageSizeChanger={[10, 25, 50, 100]}
                        paginationSize={"medium"}
                        showPreviousNext={true}
                        showInfoSummary={true}
                      />
                      
                     
                    </Tab.Pane>
                        
                      </Tab.Content>
                      </div>
                      </div>
                </Tab.Container>
              </div>
            </Container>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
