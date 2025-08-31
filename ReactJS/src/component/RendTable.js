import React from "react";
import DataGrid, { Column, Paging, FilterRow, HeaderFilter, Grouping, GroupPanel, ColumnFixing, Summary, TotalItem, GroupItem, Pager, Scrolling } from 'devextreme-react/data-grid';
import { host } from '../Modul';
// import 'devextreme/dist/css/dx.light.css';
// import 'devextreme/dist/css/dx.greenmist.css';
// import 'devextreme/dist/css/dx.darkviolet.css';

class RendTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thead: [],
            tbody: [],
            opt: [],
            group: [],
            event: {},
            id: "tableID",
            colorTheme: localStorage.getItem("ColorTheme"),
            limit: 100,
            expandGroup: false
        };
    }

    componentDidMount() {
        // let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        // if (ColorTheme == "dark") {
        //     this.setState({ colorTheme: "dark" });
        //     document.getElementById("theme-link").href = "https://cdn.jsdelivr.net/npm/devextreme@23.2/dist/css/dx.material.blue.dark.compact.css";
        // } else {
        //     this.setState({ colorTheme: "light" });
        //     document.getElementById("theme-link").href = "https://cdn.jsdelivr.net/npm/devextreme@23.2/dist/css/dx.material.blue.light.compact.css";
        // }
        this.handleRender();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.thead !== this.props.thead || prevProps.tbody !== this.props.tbody || prevProps.expandGroup !== this.props.expandGroup) this.handleRender();
    }

    handleRender() {
        let thead = this.props.thead || [];
        let tbody = this.props.tbody || [];
        let opt = this.props.opt || [];
        let group = this.props.group || [];
        let summary = this.props.summary || [];
        let sumgroup = this.props.sumgroup || [];
        let limit = this.props.limit || 100;
        let event = this.props.event || {};
        let id = this.props.id || "tableID";
        let expandGroup = this.props.expandGroup == false ? false : true;
        let colorTheme = localStorage.getItem("ColorTheme");
        this.setState({ thead, tbody, opt, group, colorTheme, limit, summary, sumgroup, event, expandGroup, id });
    }

    handleActive(e) {
        var activeElements = document.querySelectorAll('.table-active');
        activeElements.forEach(function (element) {
            element.classList.remove('table-active');
        });
        if (e.target.tagName == "TD") {
            e.target.parentNode.classList.add("table-active");
        }
    }

    handleClick() {
        return false;
    }

    render() {
        return (
            <div className="table-responsive">
                <DataGrid
                    dataSource={this.state.tbody}
                    showBorders={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                    rowAlternationEnabled={true}
                    theme={this.state.colorTheme == "dark" ? "dx-theme-darkviolet" : "dx-theme-greenmist"}
                    onRowClick={this.state.event.click || this.handleClick()}
                    wordWrapEnabled={true}
                    id={this.state.id}
                    style={{ maxHeight: "80vh" }}
                    focusedRowEnabled={true}
                    rowRenderingMode="virtual"
                    keyExpr="ID"
                >
                    {
                        this.state.thead.map((tr, ii) => {
                            if (tr.type == "number") {
                                return <Column dataField={tr.sort} caption={tr.cap} dataType="number" format={{ type: 'fixedPoint' }} key={ii} />
                            } else if (tr.type == "date") {
                                return <Column dataField={tr.sort} caption={tr.cap} dataType="date" format="dd MMMM yyyy" key={ii} />
                            } else if (tr.type == "datetime") {
                                return <Column dataField={tr.sort} caption={tr.cap} dataType="date" format="dd MMMM yyyy H:mm:ss" key={ii} />
                            } else if (tr.type == "boolean") {
                                return <Column caption={tr.cap} key={ii}
                                    cellRender={(rowData) => (
                                        <span className={`badge rounded-pill ${rowData.data[tr.sort] == 1 ? 'bg-primary' : 'bg-danger'}`}>
                                            {rowData.data[tr.sort] == 1 ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    )}
                                />
                            } else if (tr.type == "boolean2") {
                                return <Column caption={tr.cap} key={ii}
                                    cellRender={(rowData) => (
                                        <span className={`badge rounded-pill ${rowData.data[tr.sort] == 1 ? 'bg-primary' : 'bg-danger'}`}>
                                            {rowData.data[tr.sort] == 1 ? 'Ya' : 'Tidak'}
                                        </span>
                                    )}
                                />
                            } else if (tr.type == "img") {
                                return <Column caption={tr.cap} key={ii}
                                    cellRender={(rowData) => (
                                        <img src={host + 'file/' + rowData.data[tr.sort]} width="100px" height="100px" />
                                    )}
                                />
                            } else if (tr.type == "opsi") {
                                return <Column caption={tr.cap} key={ii}
                                    cellRender={(rowData) => (
                                        <div className="d-flex gap-2">
                                            {
                                                this.state.opt.map((opt, i) => {
                                                    if (opt.icon != "checkbox") {
                                                        let color = opt.color || "btn-icon";
                                                        return (
                                                            <i className={opt.icon + ' ' + color} key={i} onClick={() => opt.fn(rowData.data, rowData.rowIndex)}></i>
                                                        )
                                                    } else {
                                                        return (
                                                            <div className="form-check form-switch" key={i}>
                                                                <input className="form-check-input" name='IsWajib' type="checkbox" role="switch" id={this.state.id + rowData.data.ID} checked={rowData.data.checked == 1 ? true : false} onChange={(e) => opt.fn(rowData.data, rowData.rowIndex)} />
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    )}
                                />
                            } else if (tr.type == "checkbox") {
                                return <Column
                                    key={ii}
                                    headerCellRender={() => (
                                        <div className="form-check form-switch d-flex justify-content-center">
                                            <input className="form-check-input" type="checkbox" id={`chk${this.state.id}`} onChange={(e) => tr.fn(e)} />
                                            <label className="form-check-label" htmlFor={`chk${this.state.id}`}>{tr.cap}</label>
                                        </div>
                                    )}
                                    cellRender={(rowData) => (
                                        <div className="form-check form-switch" key={ii}>
                                            <input className="form-check-input" name='IsWajib' type="checkbox" role="switch" id={this.state.id + rowData.data.ID} checked={rowData.data[tr.sort]} onChange={(e) => tr.fnitem(e, rowData.data, rowData.rowIndex)} />
                                        </div>
                                    )}
                                />
                            } else if (tr.type == "list") {
                                return <Column
                                    caption={tr.cap}
                                    key={ii}
                                    cellRender={(rowData) => {
                                        const raw = rowData.data[tr.sort];
                                        const items = raw;

                                        return (
                                            <div className="d-flex gap-2 flex-wrap">
                                                {items.map((item, idx) => (
                                                    <span key={idx} className="badge bg-primary rounded-pill">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    }}
                                />
                            } else if (tr.type == "tag") {
                                return <Column
                                    caption={tr.cap}
                                    key={ii}
                                    cellRender={(rowData) => {
                                        const raw = rowData.data[tr.sort];
                                        const items = typeof raw === 'string' ? raw.split('#') : [];

                                        return (
                                            <div className="d-flex gap-2 flex-wrap">
                                                {items.map((item, idx) => (
                                                    <span key={idx} className="badge bg-primary rounded-pill">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    }}
                                />
                            } else if (tr.type == "html") {
                                return (
                                    <Column
                                        dataField={tr.sort}
                                        caption={tr.cap}
                                        key={ii}
                                        cellRender={(cellData) => (
                                            <div dangerouslySetInnerHTML={{ __html: cellData.value }} />
                                        )}
                                    />
                                );
                            } else if (tr.type == "index") {
                                return <Column
                                    caption={tr.cap}
                                    alignment="center"
                                    cellRender={(data) => {
                                        return data.rowIndex + 1;
                                    }}
                                />
                            } else {
                                return <Column dataField={tr.sort} caption={tr.cap} key={ii} />
                            }
                        })
                    }
                    {
                        this.state.group.map((gp, i) => {
                            return <Column dataField={gp.sort} caption={gp.cap} groupIndex={i} key={i} />
                        })
                    }
                    <Paging defaultPageSize={this.state.limit} />
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <GroupPanel visible={true} />
                    <Grouping autoExpandAll={this.state.expandGroup} />
                    <ColumnFixing enabled={true} />
                    {/* <Scrolling mode="virtual" /> */}
                    <Summary>
                        <TotalItem column="ID" summaryType="count" />
                        <GroupItem column="ID" summaryType="count" displayFormat="{0} Data" />
                    </Summary>
                    <Pager allowedPageSizes={[50, 100, 150, 200, 1000]} showPageSizeSelector={true} />
                </DataGrid>
            </div >
        );
    }
}

export default RendTable;