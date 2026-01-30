<p align="center">
  <img src="images/medium_graph_stock.png" alt="Diversifying Portfolios with Graph Databases" width="900"/>
</p>

<p align="center">
  Check out our <a href="slides/205%20Final%20Presentation.pdf">presentation</a> &nbsp; | &nbsp;
  Read our <a href="https://medium.com/@maia_kennedy/beyond-the-matrix-a-graph-data-science-approach-to-smarter-stock-portfolio-diversification-e220047548ac">Medium article</a>
</p>

# Diversifying Portfolio with Graph Databases

## Overview
We model diversification as a **graph problem** over NASDAQ-100 equities. Stocks become nodes; edges encode **statistical similarity** (price co-movement, volume behavior) to surface **clusters, influence, and bridge stocks** that matter for portfolio construction. We compute five complementary signals:

- **Pearson correlation** (price co-movement)
- **Louvain modularity** (communities/sectors that move together)
- **Jaccard similarity** (co-occurrence in volume regimes to encourage spread)
- **Betweenness centrality** (bridge stocks spanning communities)
- **PageRank** (influence within the correlation network)

We also outline how a **real-time path** could work with **Redis** for price streams and **MongoDB** for flexible per-ticker analytics snapshots (keys: similar/dissimilar lists, scores, community id).

**Team:** Hannah MacDonald, Maia Kennedy, Ryan Farhat-Sabet, Krishna Tummalapalli

## Methodology

### 1) Data shaping
- Pull daily OHLCV for NASDAQ-100; standardize tickers and trading days
- Build a tidy panel: `(ticker, date, close, volume)`
- Optional: filter to a representative sub-universe for clarity (`data/sub_nasdaq100.csv`)

### 2) Graph construction
- Compute **Pearson ρ** for each pair on closing prices (aligned dates)
- Build an undirected edge if `|ρ|` exceeds a threshold:
  - `ρ ≥ +0.80` → **strong positive** (move together)
  - `|ρ| ≤ 0.20` → **weak/uncorrelated**
  - `ρ ≤ −0.80` → **strong negative** (inverse movement)
- For **Jaccard**, bucket daily volume into **Low / Medium / High** and compare set overlap of volume regimes between tickers.

### 3) Algorithms & what they tell us
- **Pearson correlation:** identifies **substitutes** (positively correlated) and **hedges** (negatively correlated).
- **Louvain communities:** reveals **natural clusters** (often sector-like), used to balance exposure across groups.
- **Jaccard (volume):** pushes diversification across **trading-behavior regimes**, not just price paths.
- **Betweenness:** finds **bridges** connecting clusters; useful to avoid concentration in “choke points.”
- **PageRank:** highlights **structurally influential** names within the correlation network.

## Repository Map

### `code/` (analysis notebooks)
- `nasdaq100_eda.ipynb` — quick universe + sanity checks
- `Pearson_Correlation.ipynb` — compute ρ matrix; export high/low/negative edge lists
- `Louvain_Algorithm_Sub_Nasaq1....ipynb` — community detection over the correlation graph
- `Page_Rank_Algorithm_Sub_Nas...ipynb` — influence scoring
- `Betweenness.ipynb` — bridge/flow importance
- `jaccard_similarity.ipynb` — volume-bucket similarity
- `load_to_mongo.ipynb` — example document upsert pattern for per-ticker analytics

### `data/` (small, portfolio-safe artifacts and results)
- `sub_nasdaq100.csv` — subset universe used in demos
- `pearson_high_correlation_0.8_or...csv` — edges for strong positive pairs
- `pearson_low_correlation_0.2_or...csv` — near-uncorrelated pairs
- `pearson_high_negative_correlation...csv` — strong negative pairs
- `louvain_communities_full.csv` — `(ticker, community_id)`
- `pagerank_results_full.csv`, `betweenness_results_full.csv` — node scores
- `jaccard_similarity.csv` — volume-regime similarity outputs

> Large raw files and classroom datasets were removed.

### `images/`
- Graph views (used in Slides)

### `slides/`
- `205 Final Presentation.pdf` — project deck (linked at top of repo)

## Data
- Source: Publicly available NASDAQ-100 and sector classification data
- Note: Large raw data files (e.g., NASDAQ_100_Data_From_2010.csv) were removed.
  - The sub_nasdaq100.csv is our smaller demonstration sample.
 
## Tools & Technologies
- Neo4j – Graph database for data modeling and querying
- Cypher – Query language for relationships and network patterns
- Python – Automates CSV imports and graph population
- Pandas & NetworkX – For data prep and correlation analysis

## Notes & limits
- Correlation ≠ causation; signals reflect co-movement, not fundamentals
- Thresholds (e.g., ±0.80, 0.20) are tunable—trade off coverage vs. noise
- Consider rolling windows to avoid stale relationships
- Use sector/industry metadata as priors rather than hard rules

