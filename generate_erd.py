# dikerjakan oleh: distania_9
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image

def create_erd():
    fig, ax = plt.subplots(figsize=(24, 14), dpi=300)
    fig.patch.set_facecolor('#0f172a')  # Dark slate navy
    ax.set_facecolor('#0f172a')

    # Title
    ax.text(12, 13.3, "ERD-OpenJob-versi-1", fontsize=28, fontweight='bold', color='#f8fafc', ha='center', va='center', family='sans-serif')
    ax.text(12, 12.8, "Entity Relationship Diagram — OpenJob RESTful API (Dicoding Submission)", fontsize=14, color='#94a3b8', ha='center', va='center', family='sans-serif')

    # Entity definitions: (x, y, width, height, title, rows: [(name, type, constraint)])
    tables = {
        'users': {
            'x': 1.0, 'y': 6.8, 'w': 4.5, 'h': 4.8,
            'title': 'users',
            'color': '#3b82f6',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('name', 'VARCHAR(255)', ''),
                ('email', 'VARCHAR(255)', 'UNIQUE'),
                ('password', 'TEXT', ''),
                ('role', 'VARCHAR(50)', ''),
                ('created_at', 'TIMESTAMPTZ', ''),
                ('updated_at', 'TIMESTAMPTZ', '')
            ]
        },
        'authentications': {
            'x': 1.0, 'y': 3.2, 'w': 4.5, 'h': 2.4,
            'title': 'authentications',
            'color': '#64748b',
            'rows': [
                ('token', 'TEXT', 'PK')
            ]
        },
        'companies': {
            'x': 18.5, 'y': 7.6, 'w': 4.5, 'h': 4.3,
            'title': 'companies',
            'color': '#10b981',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('name', 'VARCHAR(255)', ''),
                ('location', 'VARCHAR(255)', ''),
                ('description', 'TEXT', 'NULL'),
                ('created_at', 'TIMESTAMPTZ', ''),
                ('updated_at', 'TIMESTAMPTZ', '')
            ]
        },
        'categories': {
            'x': 18.5, 'y': 2.6, 'w': 4.5, 'h': 3.6,
            'title': 'categories',
            'color': '#f59e0b',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('name', 'VARCHAR(255)', ''),
                ('created_at', 'TIMESTAMPTZ', ''),
                ('updated_at', 'TIMESTAMPTZ', '')
            ]
        },
        'jobs': {
            'x': 12.2, 'y': 2.2, 'w': 4.8, 'h': 9.2,
            'title': 'jobs',
            'color': '#8b5cf6',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('company_id', 'VARCHAR(50)', 'FK'),
                ('category_id', 'VARCHAR(50)', 'FK'),
                ('title', 'VARCHAR(255)', ''),
                ('description', 'TEXT', 'NULL'),
                ('job_type', 'VARCHAR(50)', ''),
                ('experience_level', 'VARCHAR(50)', ''),
                ('location_type', 'VARCHAR(50)', ''),
                ('location_city', 'VARCHAR(100)', 'NULL'),
                ('salary_min', 'BIGINT', 'NULL'),
                ('salary_max', 'BIGINT', 'NULL'),
                ('is_salary_visible', 'BOOLEAN', ''),
                ('status', 'VARCHAR(50)', ''),
                ('created_at', 'TIMESTAMPTZ', ''),
                ('updated_at', 'TIMESTAMPTZ', '')
            ]
        },
        'applications': {
            'x': 6.6, 'y': 7.2, 'w': 4.5, 'h': 4.4,
            'title': 'applications',
            'color': '#ec4899',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('user_id', 'VARCHAR(50)', 'FK'),
                ('job_id', 'VARCHAR(50)', 'FK'),
                ('status', 'VARCHAR(50)', ''),
                ('created_at', 'TIMESTAMPTZ', ''),
                ('updated_at', 'TIMESTAMPTZ', '')
            ]
        },
        'bookmarks': {
            'x': 6.6, 'y': 2.0, 'w': 4.5, 'h': 3.8,
            'title': 'bookmarks',
            'color': '#06b6d4',
            'rows': [
                ('id', 'VARCHAR(50)', 'PK'),
                ('user_id', 'VARCHAR(50)', 'FK'),
                ('job_id', 'VARCHAR(50)', 'FK'),
                ('created_at', 'TIMESTAMPTZ', '')
            ]
        }
    }

    def draw_table(t):
        x, y, w, h = t['x'], t['y'], t['w'], t['h']
        color = t['color']
        # Card Background
        card = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.04,rounding_size=0.15",
                                      facecolor='#1e293b', edgecolor='#334155', linewidth=1.5, zorder=2)
        ax.add_patch(card)

        # Header Box
        header_h = 0.75
        header = patches.FancyBboxPatch((x, y + h - header_h), w, header_h,
                                        boxstyle="round,pad=0.04,rounding_size=0.15",
                                        facecolor=color, edgecolor=color, linewidth=1, zorder=3)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - header_h/2, t['title'], fontsize=14, fontweight='bold', color='#ffffff',
                ha='center', va='center', zorder=4, family='sans-serif')

        # Rows
        row_h = (h - header_h - 0.2) / len(t['rows'])
        cur_y = y + h - header_h - 0.2
        for i, (col_name, col_type, constraint) in enumerate(t['rows']):
            row_y = cur_y - (i + 0.5) * row_h
            # Column name
            ax.text(x + 0.25, row_y, col_name, fontsize=10.5, fontweight='bold' if constraint in ['PK', 'FK'] else 'normal',
                    color='#f8fafc', ha='left', va='center', zorder=4, family='monospace')
            # Column type
            ax.text(x + w - 1.2, row_y, col_type, fontsize=9.5, color='#94a3b8', ha='right', va='center', zorder=4, family='monospace')
            # Constraint Badge
            if constraint:
                badge_color = '#ef4444' if constraint == 'PK' else ('#3b82f6' if constraint == 'FK' else '#64748b')
                badge = patches.FancyBboxPatch((x + w - 1.05, row_y - 0.16), 0.9, 0.32,
                                              boxstyle="round,pad=0.02,rounding_size=0.06",
                                              facecolor=badge_color, edgecolor=badge_color, zorder=4)
                ax.add_patch(badge)
                ax.text(x + w - 0.6, row_y, constraint, fontsize=8, fontweight='bold', color='#ffffff',
                        ha='center', va='center', zorder=5, family='sans-serif')
            
            # Subtle divider
            if i < len(t['rows']) - 1:
                ax.plot([x + 0.1, x + w - 0.1], [row_y - row_h/2, row_y - row_h/2], color='#334155', linewidth=0.5, zorder=3)

    for t in tables.values():
        draw_table(t)

    # Relationship connectors
    def draw_connector(p1, p2, label1="1", label2="N", color="#94a3b8", rad=0):
        # Draw line
        ax.annotate("", xy=p2, xytext=p1,
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=2.0,
                                    shrinkA=4, shrinkB=4,
                                    connectionstyle=f"arc3,rad={rad}"),
                    zorder=1)
        # Relationship cardinality labels
        ax.text(p1[0], p1[1], label1, fontsize=10, fontweight='bold', color=color,
                bbox=dict(boxstyle="circle,pad=0.2", fc="#0f172a", ec=color, lw=1),
                ha='center', va='center', zorder=5)
        ax.text(p2[0], p2[1], label2, fontsize=10, fontweight='bold', color=color,
                bbox=dict(boxstyle="circle,pad=0.2", fc="#0f172a", ec=color, lw=1),
                ha='center', va='center', zorder=5)

    # 1. users (1) -> applications (N)
    draw_connector((5.5, 9.2), (6.6, 9.2), label1="1", label2="N", color="#ec4899")

    # 2. jobs (1) -> applications (N)
    draw_connector((12.2, 9.2), (11.1, 9.2), label1="1", label2="N", color="#ec4899")

    # 3. users (1) -> bookmarks (N)
    draw_connector((4.5, 6.8), (6.6, 4.0), label1="1", label2="N", color="#06b6d4", rad=0.1)

    # 4. jobs (1) -> bookmarks (N)
    draw_connector((12.2, 4.0), (11.1, 4.0), label1="1", label2="N", color="#06b6d4")

    # 5. companies (1) -> jobs (N)
    draw_connector((18.5, 9.5), (17.0, 9.5), label1="1", label2="N", color="#10b981")

    # 6. categories (1) -> jobs (N)
    draw_connector((18.5, 4.4), (17.0, 4.4), label1="1", label2="N", color="#f59e0b")

    # Legend / Info box
    legend_box = patches.FancyBboxPatch((1.0, 0.4), 22.0, 1.2, boxstyle="round,pad=0.03,rounding_size=0.1",
                                       facecolor='#1e293b', edgecolor='#334155', linewidth=1)
    ax.add_patch(legend_box)
    ax.text(2.0, 1.0, "Keterangan Relasi & Simbol:", fontsize=11, fontweight='bold', color='#f8fafc', va='center')
    ax.text(6.0, 1.0, "PK : Primary Key", fontsize=10, color='#ef4444', fontweight='bold', va='center')
    ax.text(8.5, 1.0, "FK : Foreign Key (ON DELETE CASCADE)", fontsize=10, color='#3b82f6', fontweight='bold', va='center')
    ax.text(14.0, 1.0, "UNIQUE : Unique Constraint", fontsize=10, color='#94a3b8', fontweight='bold', va='center')
    ax.text(18.5, 1.0, "1 ─── N : One-to-Many Relationship", fontsize=10, color='#10b981', fontweight='bold', va='center')

    ax.set_xlim(0, 24)
    ax.set_ylim(0, 14)
    ax.axis('off')

    plt.tight_layout()
    plt.savefig('ERD-OpenJob-versi-1.png', dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    
    # Save JPG with Pillow
    im = Image.open('ERD-OpenJob-versi-1.png').convert('RGB')
    im.save('ERD-OpenJob-versi-1.jpg', quality=95)
    print("ERD-OpenJob-versi-1.png and ERD-OpenJob-versi-1.jpg generated successfully!")

if __name__ == '__main__':
    create_erd()
