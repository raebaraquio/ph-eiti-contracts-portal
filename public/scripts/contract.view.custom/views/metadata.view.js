var MetadataToggleButton = React.createClass({
    getInitialState: function() {
        return {
            showMeta: true
        }
    },
    handleClick: function() {
        if(this.state.showMeta) {
            this.setState({showMeta: false});
            // this.props.contractApp.set({showMeta: true});
            $('.right-column-view').hide();
            $('.metadata-toggle-button').removeClass("metadata-shown");
            $('.pdf-viewer').css("width","70%");
            $(".text-panel").css("width","70%");
        }
        else {
            // this.props.contractApp.set({showMeta: false});
            // location.hash="/meta/hide";
            this.setState({showMeta: true});
            $('.metadata-toggle-button').addClass("metadata-shown");
            $('.right-column-view').show();            
            $('.pdf-viewer').css("width","50%");
            $(".text-panel").css("width","50%");
        }
    },
    render: function() {
        return (
            <div className="metadata-toggle-button pull-right metadata-shown">
                <span onClick={this.handleClick}>Meta</span>
            </div>
        );
    }
});

var MetadataView = React.createClass({
    getInitialState: function() {
        return {
            showMoreMetadata: false
        }
    },
    componentDidMount: function() {
        var self = this;
        this.props.metadata.on("sync", function() {
            self.forceUpdate();
        });
    },
    clickShowMoreMetadata: function(e) {
        e.preventDefault();
        this.setState({showMoreMetadata: !this.state.showMoreMetadata});
        if(!this.state.showMoreMetadata) {
            $(".metadata-view .show-more-meta").show(500);
        } else {
            $(".metadata-view .show-more-meta").hide(500);
        }
    },
    render: function() {
        var showLabel = "Show more";
        if(this.state.showMoreMetadata) {
            showLabel = "Show less";
        }
        if(this.props.metadata.get("country")) {
            return (
                <div className="metadata-view">
                    <div>
                        Metadata
                        <div className="metadata-view-footer pull-right">
                            <a href={this.props.contractApp.getMetadataSummaryLink()}>See Summary</a>
                        </div>
                    </div>

                    <div className="metadata-country">
                        <span>Country</span>
                        <span>{this.props.metadata.get("country").name}</span>
                    </div>
                    <div className="metadata-signature-year">
                        <span>Signature year</span>
                        <span>{this.props.metadata.get("year_signed") || "-"}</span>
                    </div>
                    <div className="metadata-resource">
                        <span>Resources</span>
                        <span>{this.props.metadata.get("resource").join(", ")}</span>
                    </div>
                    <div className="metadata-type-contract">
                        <span>Type of Contract</span>
                        <span>{this.props.metadata.get("type")}</span>
                    </div>
                    <div className="metadata-ocid">
                        <span>Open Contracting Identifier</span>
                        <span>{this.props.metadata.get("open_contracting_id")}</span>
                    </div>
                </div>
            );            
        } else {
            return (
                <div className="metadata-view">
                    <div>Metadata</div>
                    <span>Loading... </span>
                    <div className="metadata-view-footer">
                        <a href={this.props.contractApp.getMetadataSummaryLink()}>See summary</a>
                    </div>
                </div>
            );
        }

    }
});

var RelatedDocumentsView = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.props.metadata.on("sync", function() {
            self.forceUpdate();
        });
    },
    render: function() {
        function truncate(text) {
            var words = (text + "").split(" ");
            var ellipsis = ""
            if(words.length > 10) {
                ellipsis = " ...";
            }
            words = words.splice(0, 10);
            return words.join(" ") + ellipsis;
        }        
        var parentContracts = "", 
            supportingContracts = []
            moreContracts = "";
        if(this.props.metadata.get("parent")) {
             parentContracts = this.props.metadata.get("parent").map(function(doc) {
                var docUrl = app_url + "/contract/" + doc.id;
                if(doc.is_published===true){
                    return (
                        <span>
                            <a href={docUrl}>{doc.name}</a>
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {doc.name}
                        </span>
                    );
                }
            });
            var MaxAllowed = 2;
            var maxDocs = (this.props.metadata.get("associated").length < MaxAllowed)?this.props.metadata.get("associated").length:MaxAllowed;
            for(var i = 0;i < maxDocs; i++) {
                var doc = this.props.metadata.get("associated")[i];
                if(doc.is_published === true) {
                    var docUrl = app_url + "/contract/" + doc.id;
                    supportingContracts.push(<span id={i}><a href={docUrl}>{truncate(doc.name)}</a></span>);
                } else {
                    supportingContracts.push(<span id={i}>{truncate(doc.name)}</span>);
                }
            }
            if(this.props.metadata.get("associated").length > MaxAllowed) {
                moreContracts = (<span><a href={this.props.contractApp.getMetadataSummaryLink() + "#relateddocs"}>All related ...</a></span>);
            }
            if(parentContracts.length || supportingContracts.length) {
                return (
                    <div className="relateddocument-view">
                        <div>Related docs</div>
                        {parentContracts}
                        {supportingContracts}
                        {moreContracts}
                    </div>
                );
            } else {
                return (<div></div>);
            }
        } else {
            return (
                <div className="relateddocument-view">
                    <div>Related docs</div>
                    Loading...
                </div>
            );
        }

    }
});
var RelatedDocumentsMoreView = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.props.metadata.on("sync", function() {
            self.forceUpdate();
        });
    },
    render: function() {
        if(this.props.metadata.get("country")) {
            var countryCode = this.props.metadata.get("country").code.toLowerCase();
            var countryLink = app_url + "/countries/" + countryCode;
            var country = React.createElement('a', {href: countryLink}, this.props.metadata.get("country").name);
            var resourceLinkBase = app_url + "/resources/";
            var resources = this.props.metadata.get("resource").map(function(resource, i) {
                return React.createElement('a', {href: app_url + "/resource/" + resource, key: i}, resource);
            });
            return (
                <div className="relateddocument-more-view">
                    <div>More</div>
                    <div>
                        <div>From {country}</div>
                        <div>For {resources}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="relateddocument-more-view">
                    <div>More</div>
                    <span>Loading...</span>
                </div>
            );
        }
    }
});
var OtherSourcesView = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.props.metadata.on("sync", function() {
            self.forceUpdate();
        });
    },
    render: function() {
        if(this.props.metadata.get("company")) {
            var amla_url = this.props.metadata.get("amla_url");
            var amlaUrlLink = (<span><a href={amla_url}>{this.props.metadata.get("country").name}</a> Legislation</span>);

            if(amla_url) {
                return (
                    <div className="other-sources-view">
                        <div>Other Sources</div>
                        <div>
                            <div>{amlaUrlLink}</div>
                        </div>
                    </div>
                );                
            } else {
                return (<div></div>);
            }
        } else {
            return (
                <div className="other-sources-view">
                    <div>Other Sources</div>
                    <span>Loading...</span>
                </div>
            );
        }
    }
});
var RightColumnView = React.createClass({
    render: function() {
        return (
            <div className="right-column-view">
                <MetadataView 
                    contractApp={this.props.contractApp}
                    metadata={this.props.metadata} />
                <RelatedDocumentsView
                    contractApp={this.props.contractApp}
                    metadata={this.props.metadata} />
                <RelatedDocumentsMoreView
                    metadata={this.props.metadata} />
            </div>
        );
    }
});