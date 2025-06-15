#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel数据处理脚本
将金陵数据.xlsx中的地点表和事件表转换为CSV文件
"""

import pandas as pd
import os
import sys

def process_excel_to_csv():
    """
    处理Excel文件，将地点表和事件表导出为CSV
    """
    
    # Excel文件路径
    excel_file = 'data/金陵数据.xlsx'
    
    # 检查文件是否存在
    if not os.path.exists(excel_file):
        print(f"错误：找不到文件 {excel_file}")
        print("请确保Excel文件在data目录下")
        return
    
    try:
        # 读取Excel文件，获取所有工作表名称
        excel_data = pd.ExcelFile(excel_file)
        sheet_names = excel_data.sheet_names
        
        print(f"发现的工作表: {sheet_names}")
        
        # 查找地点相关的工作表
        location_sheets = [name for name in sheet_names if any(keyword in name.lower() for keyword in ['地点', '地名', '位置', 'location', 'place'])]
        
        # 查找事件相关的工作表
        event_sheets = [name for name in sheet_names if any(keyword in name.lower() for keyword in ['事件', '历史', '年表', 'event', 'history'])]
        
        print(f"地点相关工作表: {location_sheets}")
        print(f"事件相关工作表: {event_sheets}")
        
        # 处理地点表
        if location_sheets:
            for sheet_name in location_sheets:
                try:
                    df_location = pd.read_excel(excel_file, sheet_name=sheet_name)
                    csv_filename = f'data/{sheet_name}.csv'
                    df_location.to_csv(csv_filename, index=False, encoding='utf-8-sig')
                    print(f"✓ 地点表已保存: {csv_filename}")
                    print(f"  - 数据形状: {df_location.shape}")
                    print(f"  - 列名: {list(df_location.columns)}")
                    print(f"  - 前3行预览:")
                    print(df_location.head(3))
                    print()
                except Exception as e:
                    print(f"✗ 处理地点表 {sheet_name} 时出错: {e}")
        else:
            print("未找到地点相关的工作表，将列出所有工作表以供手动选择:")
            for i, sheet_name in enumerate(sheet_names):
                df = pd.read_excel(excel_file, sheet_name=sheet_name, nrows=3)
                print(f"{i+1}. {sheet_name} - 形状: {df.shape}, 列名: {list(df.columns)}")
        
        # 处理事件表
        if event_sheets:
            for sheet_name in event_sheets:
                try:
                    df_event = pd.read_excel(excel_file, sheet_name=sheet_name)
                    csv_filename = f'data/{sheet_name}.csv'
                    df_event.to_csv(csv_filename, index=False, encoding='utf-8-sig')
                    print(f"✓ 事件表已保存: {csv_filename}")
                    print(f"  - 数据形状: {df_event.shape}")
                    print(f"  - 列名: {list(df_event.columns)}")
                    print(f"  - 前3行预览:")
                    print(df_event.head(3))
                    print()
                except Exception as e:
                    print(f"✗ 处理事件表 {sheet_name} 时出错: {e}")
        else:
            print("未找到事件相关的工作表")
        
        # 如果没有找到对应的工作表，提供手动选择功能
        if not location_sheets and not event_sheets:
            print("\n手动处理模式:")
            print("请选择要转换的工作表（输入编号，用逗号分隔，如: 1,3）:")
            
            try:
                choice = input("选择工作表编号: ").strip()
                if choice:
                    indices = [int(x.strip()) - 1 for x in choice.split(',')]
                    for idx in indices:
                        if 0 <= idx < len(sheet_names):
                            sheet_name = sheet_names[idx]
                            df = pd.read_excel(excel_file, sheet_name=sheet_name)
                            csv_filename = f'data/{sheet_name}.csv'
                            df.to_csv(csv_filename, index=False, encoding='utf-8-sig')
                            print(f"✓ 已保存: {csv_filename}")
            except (ValueError, KeyboardInterrupt):
                print("操作取消")
        
        print("\n处理完成！")
        
    except Exception as e:
        print(f"处理Excel文件时出错: {e}")
        print("请检查文件格式和权限")

def analyze_excel_structure():
    """
    分析Excel文件结构
    """
    excel_file = 'data/金陵数据.xlsx'
    
    if not os.path.exists(excel_file):
        print(f"错误：找不到文件 {excel_file}")
        return
    
    try:
        excel_data = pd.ExcelFile(excel_file)
        print("=" * 50)
        print("Excel文件结构分析")
        print("=" * 50)
        
        for i, sheet_name in enumerate(excel_data.sheet_names):
            print(f"\n{i+1}. 工作表: {sheet_name}")
            try:
                # 只读取前几行来分析结构
                df = pd.read_excel(excel_file, sheet_name=sheet_name, nrows=5)
                print(f"   形状: {df.shape[0]}+ 行, {df.shape[1]} 列")
                print(f"   列名: {list(df.columns)}")
                
                # 显示数据类型
                print("   数据类型:")
                for col, dtype in df.dtypes.items():
                    print(f"     {col}: {dtype}")
                
                # 显示前两行数据示例
                if not df.empty:
                    print("   数据示例:")
                    for idx, row in df.head(2).iterrows():
                        print(f"     行{idx+1}: {dict(row)}")
                        
            except Exception as e:
                print(f"   ✗ 读取失败: {e}")
        
        print("\n" + "=" * 50)
        
    except Exception as e:
        print(f"分析Excel文件时出错: {e}")

if __name__ == "__main__":
    print("金陵数据Excel处理工具")
    print("-" * 30)
    
    # 检查依赖
    try:
        import pandas as pd
        import openpyxl  # Excel读取依赖
    except ImportError as e:
        print(f"缺少依赖库: {e}")
        print("请安装: pip install pandas openpyxl")
        sys.exit(1)
    
    # 创建data目录（如果不存在）
    os.makedirs('data', exist_ok=True)
    
    # 直接执行转换，如果需要分析可以传入analyze参数
    if len(sys.argv) > 1 and sys.argv[1] == 'analyze':
        analyze_excel_structure()
    else:
        print("开始转换Excel文件为CSV...")
        process_excel_to_csv() 